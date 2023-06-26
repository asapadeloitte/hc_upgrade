
import { takeUntil } from 'rxjs/operators';

import {
  Component,
  DoCheck,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostListener,
  Input,
  IterableDiffers,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  Self,
  Optional,
  ContentChildren,
  QueryList
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormControl,
  NG_VALUE_ACCESSOR,
  Validator,
  NgControl,
  NgForm
} from '@angular/forms';
import { Observable, Subject } from 'rxjs';

import { MultiSelectSearchFilter } from './search-filter.pipe';
import { ISelectOption, IMultiSelectSettings, IMultiSelectTexts } from './types';

import { ValidationMsg } from '../validation-msg/validation-msg.component';
import { hasRequiredValidator, getErrorTextFromValidationResult } from '../../utilities';

/*
 * Angular 2 Dropdown Multiselect for Bootstrap
 *
 */

const MULTISELECT_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CBASMultiSelectComponent),
  multi: true
};

let nextUniqueId = 0;

@Component({
  selector: 'app-multiselect',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  providers: [MultiSelectSearchFilter] // MULTISELECT_VALUE_ACCESSOR
})
export class CBASMultiSelectComponent
  implements OnInit, OnChanges, DoCheck, OnDestroy, ControlValueAccessor, Validator {
  private _uid = `mat-select-${nextUniqueId++}`;
  private _id: string;
  public errors: string[] = [];
  public checkedYear = false;
  filterControl: FormControl = this.fb.control('');

  @Input() options: Array<ISelectOption>;
  @Input() settings: IMultiSelectSettings;
  @Input() texts: IMultiSelectTexts;
  @Input() disabled = false;
  @Input() disabledSelection = false;
  @Input() enableSearch = false;
  @Input() placeholder: string = undefined;
  @Input() label: string;
  @Input() isRequired = false;
  @Output() selectionLimitReached = new EventEmitter();
  @Output() dropdownClosed = new EventEmitter();
  @Output() dropdownOpened = new EventEmitter();
  @Output() onAdded = new EventEmitter();
  @Output() onRemoved = new EventEmitter();
  @Output() onLazyLoad = new EventEmitter();
  @Output() onFilter: Observable<string> = this.filterControl.valueChanges;
  @Input() removeOptional: Boolean;

  @Input()
  get id(): string {
    return this._id;
  }
  set id(value: string) {
    this._id = value || this._uid;
  }

  @ContentChildren(ValidationMsg, { descendants: true })
  validationMessages: QueryList<ValidationMsg>;

  destroyed$ = new Subject<any>();

  filteredOptions: ISelectOption[] = [];
  renderFilteredOptions: ISelectOption[] = [];
  model: any[] = [];
  parents: any[];
  title: string;
  differ: any;
  numSelected = 0;
  set isVisible(val: boolean) {
    this._isVisible = val;
    this._workerDocClicked = val ? false : this._workerDocClicked;
  }
  get isVisible() {
    return this._isVisible;
  }
  renderItems = true;
  checkAllSearchRegister = new Set();
  checkAllStatus = false;
  loadedValueIds = [];

  defaultSettings: IMultiSelectSettings = {
    closeOnClickOutside: true,
    pullRight: false,
    enableSearch: false,
    searchRenderLimit: 0,
    searchRenderAfter: 1,
    searchMaxLimit: 0,
    searchMaxRenderedItems: 0,
    checkedStyle: 'checkboxes',
    buttonClasses: 'btn btn-default btn-secondary',
    containerClasses: 'dropdown',
    selectionLimit: 0,
    minSelectionLimit: 0,
    closeOnSelect: false,
    autoUnselect: false,
    showCheckAll: false,
    showUncheckAll: false,
    fixedTitle: false,
    dynamicTitleMaxItems: 1,
    maxHeight: '300px',
    isLazyLoad: false,
    stopScrollPropagation: false,
    loadViewDistance: 1,
    selectAddedValues: false
  };
  defaultTexts: IMultiSelectTexts = {
    checkAll: 'All FYs',
    uncheckAll: 'All FYs',
    checked: 'checked',
    checkedPlural: 'checked',
    searchPlaceholder: 'Search...',
    searchEmptyResult: 'Nothing Found...',
    searchNoRenderText: 'Type in search box to see results.',
    defaultTitle: 'Select One',
    allSelected: 'All Items Selected'
  };

  get searchLimit() {
    return this.settings.searchRenderLimit;
  }

  get searchRenderAfter() {
    return this.settings.searchRenderAfter;
  }

  get searchLimitApplied() {
    return this.searchLimit > 0 && this.options.length > this.searchLimit;
  }

  protected _isVisible = false;
  protected _workerDocClicked = false;

  constructor(
    protected element: ElementRef,
    protected fb: FormBuilder,
    protected searchFilter: MultiSelectSearchFilter,
    differs: IterableDiffers,
    @Self()
    @Optional()
    public ngControl: NgControl,
    @Optional() private _parentForm: NgForm
  ) {
    if (this.ngControl) {
      // Note: we provide the value accessor through here, instead of
      // the `providers` to avoid running into a circular import.
      this.ngControl.valueAccessor = this;
    }
    this.differ = differs.find([]).create(null);
    this.settings = this.defaultSettings;
    this.texts = this.defaultTexts;
    // Force setter to be called in case id was not specified.
    this.id = this.id;
  }

  @HostListener('document: click', ['$event.target'])
  onClick(target: HTMLElement) {
    if (!this.isVisible || !this.settings.closeOnClickOutside) {
      return;
    }
    let parentFound = false;
    while (target != null && !parentFound) {
      if (target === this.element.nativeElement) {
        parentFound = true;
      }
      target = target.parentElement;
    }
    if (!parentFound) {
      this.isVisible = false;
      this.dropdownClosed.emit();
    }
  }

  protected onTouchedCallback: () => void = () => { };

  validateDropDown(): void {
    this.errors = [];
    this.errors = [];
    if (this.ngControl.touched && !this.ngControl.valid && this.ngControl.errors != null) {
      // tslint:disable-next-line:forin
      for (const d in this.ngControl.errors) {
        const valMsg = this.validationMessages.find(msg => msg.validator === d);
        if (valMsg != null) {
          this.errors.push(valMsg.msg);
        } else {
          this.errors.push(getErrorTextFromValidationResult(d, this.ngControl.errors[d]));
        }
      }
    }
  }

  onBlur(): void {
    this.onModelTouched();
    // this.onTouchedCallback();
    this.validateDropDown();
  }

  getItemStyle(option: ISelectOption): any {
    if (!option.isLabel) {
      return { cursor: 'pointer' };
    }
  }

  getItemStyleSelectionDisabled(): any {
    if (this.disabledSelection) {
      return { cursor: 'default' };
    }
  }

  ngOnInit() {
    this.isRequired = this.isRequired || hasRequiredValidator(this.ngControl);
    this.settings = Object.assign(this.defaultSettings, this.settings);
    if (this.texts.defaultTitle === this.defaultTexts.defaultTitle && this.placeholder) {
      this.texts.defaultTitle = this.placeholder;
    }
    this.texts = Object.assign(this.defaultTexts, this.texts);
    this.title = this.texts.defaultTitle || '';
    this.settings.enableSearch = this.enableSearch;
    this.filterControl.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(
      function() {
        this.updateRenderItems();
        if (this.settings.isLazyLoad) {
          this.load();
        }
      }.bind(this)
    );
    if (this.ngControl) {
      this.ngControl.statusChanges.subscribe(x => {
        this.validateDropDown();
      });
    }
    if (this.removeOptional === true) {
      this.isRequired = true;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['options']) {
      const prevModel = this.model.slice();
      this.options = this.options || [];
      this.parents = this.options
        .filter(option => typeof option.parentId === 'number')
        .map(option => option.parentId);
      this.updateRenderItems();

      if (this.settings.selectAddedValues && this.loadedValueIds.length === 0) {
        this.loadedValueIds = this.loadedValueIds.concat(
          changes.options.currentValue.map(value => value.id)
        );
      }
      if (this.settings.selectAddedValues && changes.options.previousValue) {
        const addedValues = changes.options.currentValue.filter(
          value => this.loadedValueIds.indexOf(value.id) === -1
        );
        this.loadedValueIds.concat(addedValues.map(value => value.id));
        if (this.checkAllStatus) {
          this.addChecks(addedValues);
        } else if (this.checkAllSearchRegister.size > 0) {
          this.checkAllSearchRegister.forEach(searchValue =>
            this.addChecks(this.applyFilters(addedValues, searchValue))
          );
        }
      }

      if (this.texts) {
        this.updateTitle();
      }
      if (
        prevModel.length !== this.model.length ||
        prevModel.some(id => this.model.indexOf(id) === -1)
      ) {
        this.onModelChange(this.model);
        this.onModelTouched();
      }
    }

    if (changes['texts'] && !changes['texts'].isFirstChange()) {
      this.updateTitle();
    }
  }

  ngOnDestroy() {
    this.destroyed$.next();
  }

  updateRenderItems() {
    this.renderItems =
      !this.searchLimitApplied || this.filterControl.value.length >= this.searchRenderAfter;
    this.filteredOptions = this.applyFilters(
      this.options,
      this.settings.isLazyLoad ? '' : this.filterControl.value
    );
    this.renderFilteredOptions = this.renderItems ? this.filteredOptions : [];
  }

  applyFilters(options, value) {
    return this.searchFilter.transform(
      options,
      value,
      this.settings.searchMaxLimit,
      this.settings.searchMaxRenderedItems
    );
  }

  onModelChange: Function = (_: any) => { };
  onModelTouched: Function = () => { };

  writeValue(value: any): void {
    if (value !== undefined && value != null) {
      this.model = Array.isArray(value) ? value : [value];
    } else {
      this.model = [];
    }
  }

  registerOnChange(fn: Function): void {
    this.onModelChange = fn;
  }

  registerOnTouched(fn: Function): void {
    this.onModelTouched = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }

  ngDoCheck() {
    const changes = this.differ.diff(this.model);
    if (changes) {
      this.updateNumSelected();
      this.updateTitle();
    }
  }

  validate(_c: AbstractControl): { [key: string]: any } {
    return this.model && this.model.length
      ? null
      : {
        required: {
          valid: false
        }
      };
  }

  registerOnValidatorChange(_fn: () => void): void {
    throw new Error('Method not implemented.');
  }

  clearSearch(event: Event) {
    if (event.stopPropagation) {
      event.stopPropagation();
    }
    this.filterControl.setValue('');
  }

  toggleDropdown() {
    this.isVisible = !this.isVisible;
    this.isVisible ? this.dropdownOpened.emit() : this.dropdownClosed.emit();
  }

  isSelected(option: ISelectOption): boolean {
    if (this.renderFilteredOptions.length === this.model.length) {
      this.checkedYear = true;
    } else {
      this.checkedYear = false;
    }
    return this.model && this.model.indexOf(option.id) > -1;
  }

  setSelected(_event: Event, option: ISelectOption) {
    if (option.isLabel) {
      return;
    }

    if (!this.disabledSelection) {
      if (_event.stopPropagation) {
        _event.stopPropagation();
      }
      const index = this.model.indexOf(option.id);
      const isAtSelectionLimit =
        this.settings.selectionLimit > 0 && this.model.length >= this.settings.selectionLimit;
      if (index > -1) {
        const removeItem = (idx, id): void => {
          this.model.splice(idx, 1);
          this.onRemoved.emit(id);
        };

        if (
          this.settings.minSelectionLimit === undefined ||
          this.numSelected > this.settings.minSelectionLimit
        ) {
          removeItem(index, option.id);
        }
        const parentIndex = option.parentId && this.model.indexOf(option.parentId);
        if (parentIndex > -1) {
          removeItem(parentIndex, option.parentId);
        } else if (this.parents.indexOf(option.id) > -1) {
          this.options
            .filter(child => this.model.indexOf(child.id) > -1 && child.parentId === option.id)
            .forEach(child => removeItem(this.model.indexOf(child.id), child.id));
        }
      } else if (isAtSelectionLimit && !this.settings.autoUnselect) {
        this.selectionLimitReached.emit(this.model.length);
        return;
      } else {
        const addItem = (id): void => {
          this.model.push(id);
          this.onAdded.emit(id);
        };

        addItem(option.id);
        if (!isAtSelectionLimit) {
          if (option.parentId) {
            const children = this.options.filter(
              child => child.id !== option.id && child.parentId === option.parentId
            );
            if (children.every(child => this.model.indexOf(child.id) > -1)) {
              addItem(option.parentId);
            }
          } else if (this.parents.indexOf(option.id) > -1) {
            const children = this.options.filter(
              child => this.model.indexOf(child.id) < 0 && child.parentId === option.id
            );
            children.forEach(child => addItem(child.id));
          }
        } else {
          const removedOption = this.model.shift();
          this.onRemoved.emit(removedOption);
        }
      }
      if (this.settings.closeOnSelect) {
        this.toggleDropdown();
      }
      this.model = this.model.slice();
      this.onModelChange(this.model);
      this.onModelTouched();
      this.validateDropDown();
    }
  }

  updateNumSelected() {
    this.numSelected = this.model.filter(id => this.parents.indexOf(id) < 0).length || 0;
  }

  updateTitle() {
    if (this.numSelected === 0 || this.settings.fixedTitle) {
      this.title = this.texts ? this.texts.defaultTitle : '';
    } else if (this.settings.displayAllSelectedText && this.model.length === this.options.length) {
      this.title = this.texts ? this.texts.allSelected : '';
    } else if (
      this.settings.dynamicTitleMaxItems &&
      this.settings.dynamicTitleMaxItems >= this.numSelected
    ) {
      this.title = this.options
        .filter((option: ISelectOption) => this.model.indexOf(option.id) > -1)
        .map((option: ISelectOption) => option.name)
        .join(', ');
    } else {
      this.title =
        this.numSelected +
        ' ' +
        (this.numSelected === 1 ? this.texts.checked : this.texts.checkedPlural);
    }
  }

  searchFilterApplied() {
    return (
      this.settings.enableSearch && this.filterControl.value && this.filterControl.value.length > 0
    );
  }

  addChecks(options) {
    const checkedOptions = options
      .filter(
        function(option: ISelectOption) {
          if (this.model.indexOf(option.id) === -1) {
            this.onAdded.emit(option.id);
            return true;
          }
          return false;
        }.bind(this)
      )
      .map((option: ISelectOption) => option.id);
    this.model = this.model.concat(checkedOptions);
  }

  checkedSelect() {
    if (!this.checkedYear) {
      this.checkAll();
    } else {
      this.uncheckAll();
    }
  }

  checkAll() {
    if (!this.disabledSelection) {
      this.addChecks(!this.searchFilterApplied() ? this.options : this.filteredOptions);
      if (this.settings.selectAddedValues) {
        if (this.searchFilterApplied() && !this.checkAllStatus) {
          this.checkAllSearchRegister.add(this.filterControl.value);
          this.settings.showCheckAll = false;
          this.settings.showUncheckAll = true;
        } else {
          this.checkAllSearchRegister.clear();
          this.checkAllStatus = true;
        }
        this.load();
      }
      this.onModelChange(this.model);
      this.onModelTouched();
    }
  }

  uncheckAll() {
    if (!this.disabledSelection) {
      const checkedOptions = this.model;
      let unCheckedOptions = !this.searchFilterApplied()
        ? this.model
        : this.filteredOptions.map((option: ISelectOption) => option.id);
      // set unchecked options only to the ones that were checked
      unCheckedOptions = checkedOptions.filter(item => this.model.includes(item));
      this.model = this.model.filter((id: number) => {
        if (
          (unCheckedOptions.indexOf(id) < 0 && this.settings.minSelectionLimit === undefined) ||
          unCheckedOptions.indexOf(id) < this.settings.minSelectionLimit
        ) {
          return true;
        } else {
          this.onRemoved.emit(id);
          return false;
        }
      });
      if (this.settings.selectAddedValues) {
        if (this.searchFilterApplied()) {
          if (this.checkAllSearchRegister.has(this.filterControl.value)) {
            this.checkAllSearchRegister.delete(this.filterControl.value);
            this.checkAllSearchRegister.forEach(
              function(searchTerm) {
                const filterOptions = this.applyFilters(
                  this.options.filter(option => unCheckedOptions.includes(option.name)),
                  searchTerm
                );
                this.addChecks(filterOptions);
                this.settings.showUncheckAll = false;
                this.settings.showCheckAll = true;
              }.bind(this)
            );
          }
        } else {
          this.checkAllSearchRegister.clear();
          this.checkAllStatus = false;
        }
        this.load();
      }
      this.onModelChange(this.model);
      this.onModelTouched();
    }
  }

  preventCheckboxCheck(event: Event, option: ISelectOption) {
    if (
      this.settings.selectionLimit &&
      !this.settings.autoUnselect &&
      this.model.length >= this.settings.selectionLimit &&
      this.model.indexOf(option.id) === -1 &&
      event.preventDefault
    ) {
      event.preventDefault();
    }
  }

  isCheckboxDisabled(): boolean {
    return this.disabledSelection;
  }

  checkScrollPosition(ev) {
    const scrollTop = ev.target.scrollTop;
    const scrollHeight = ev.target.scrollHeight;
    const scrollElementHeight = ev.target.clientHeight;
    const roundingPixel = 1;
    const gutterPixel = 1;

    if (
      scrollTop >=
      scrollHeight -
      (1 + this.settings.loadViewDistance) * scrollElementHeight -
      roundingPixel -
      gutterPixel
    ) {
      this.load();
    }
  }

  checkScrollPropagation(ev, element) {
    const scrollTop = element.scrollTop;
    const scrollHeight = element.scrollHeight;
    const scrollElementHeight = element.clientHeight;

    if (
      (ev.deltaY > 0 && scrollTop + scrollElementHeight >= scrollHeight) ||
      (ev.deltaY < 0 && scrollTop <= 0)
    ) {
      ev = ev || window.event;
      if (ev.preventDefault) {
        ev.preventDefault();
      }
      ev.returnValue = false;
    }
  }

  load() {
    this.onLazyLoad.emit({
      length: this.options.length,
      filter: this.filterControl.value,
      checkAllSearches: this.checkAllSearchRegister,
      checkAllStatus: this.checkAllStatus
    });
  }
  clearSelectionButtonVisible(option: any): boolean {
    return false;
  }
  clearSelection(event: MouseEvent): void {
    throw Error('Not applicable for multi select');
  }
}

const SELECT_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CBASSelectComponent),
  multi: true
};

@Component({
  selector: 'app-select',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  providers: [MultiSelectSearchFilter] // SELECT_VALUE_ACCESSOR
})
export class CBASSelectComponent extends CBASMultiSelectComponent {
  /**
   *
   */
  constructor(
    protected element: ElementRef,
    protected fb: FormBuilder,
    protected searchFilter: MultiSelectSearchFilter,
    differs: IterableDiffers,
    @Self()
    @Optional()
    public ngControl: NgControl,
    @Optional() _parentForm: NgForm
  ) {
    super(element, fb, searchFilter, differs, ngControl, _parentForm);
    this.defaultSettings.autoUnselect = true;
    this.defaultSettings.selectionLimit = 1;
    this.defaultSettings.closeOnSelect = true;
    this.defaultSettings.dynamicTitleMaxItems = 1;
  }
  private onChangeCallback: Function = (_: any) => { };

  registerOnChange(fn): void {
    this.onChangeCallback = fn;
    this.onModelChange = (changed: any[]) => {
      if (changed && changed.length > 0) {
        this.onChangeCallback(changed[0]);
      } else {
        this.onChangeCallback(null);
      }
    };
  }
  clearSelectionButtonVisible(option: any): boolean {
    return this.model != null && this.model.length > 0 && this.model[0] === option.id;
  }
  clearSelection(event: MouseEvent): void {
    this.model = [];
    this.onModelChange([]);
    event.stopPropagation();
    if (this.settings.closeOnSelect) {
      this.toggleDropdown();
    }
    this.onModelTouched();
    this.validateDropDown();
  }

  keyDownFunction(event: KeyboardEvent, option: ISelectOption): void {
    if (event.keyCode === 13) {
      this.setSelected(event, option);
    }
  }
}
