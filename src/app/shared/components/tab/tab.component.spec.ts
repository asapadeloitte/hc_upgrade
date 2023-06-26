/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { TabComponent } from './tab.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ReactiveFormsModule } from '@angular/forms';
import { HumanCapitalService } from '../../services/humanCapital.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ApiEndpointsConfig } from 'src/app/app-api-endpoints.config';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';

describe('TabComponent', () => {
  let component: TabComponent;
  let fixture: ComponentFixture<TabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TabComponent],
      providers: [HumanCapitalService, ApiEndpointsConfig, BsModalService],
      imports: [TabsModule.forRoot(), ReactiveFormsModule, HttpClientTestingModule, ModalModule.forRoot()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabComponent);
    component = fixture.componentInstance;

    component.tabs = [
      { title: 'Pre-Commitment', content: 'Pre-Commitment', active: true },
      { title: 'Post-Commitment', content: 'Post-Commitment', active: false },
      { title: 'Award', content: 'Award', active: false },
      { title: 'Notes', content: 'Notes', active: false }
    ];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('tabActive should be Notes', () => {
    component.tabActive = 'Notes';
    expect(component.tabActive).toBeTruthy();
    component.ngOnInit();
  });

  it('tabActive should be Pre-Commitment', () => {
    component.tabActive = 'Pre-Commitment';
    expect(component.tabActive).toBeTruthy();
    component.ngOnInit();
  });

  it('tabActive should be Post-Commitment', () => {
    component.tabActive = 'Post-Commitment';
    expect(component.tabActive).toBeTruthy();
    component.ngOnInit();
  });

  it('tabActive should be Award', () => {
    component.tabActive = 'Award';
    expect(component.tabActive).toBeTruthy();
    component.ngOnInit();
  });

  describe('onTabSelect function', () => {
    it('onTabSelect active heading Pre-Commitment', () => {
      const event = { heading: 'Pre-Commitment' };
      component.onTabSelect(event);
      expect(component.preCommitment).toBe(true);
      expect(component.postCommitment).toBe(false);
      expect(component.award).toBe(false);
      expect(component.notesTab).toBe(false);
    });

    it('onTabSelect active heading Post-Commitment', () => {
      const event = { heading: 'Post-Commitment' };
      component.onTabSelect(event);
      expect(component.preCommitment).toBe(false);
      expect(component.postCommitment).toBe(true);
      expect(component.award).toBe(false);
      expect(component.notesTab).toBe(false);
    });

    it('onTabSelect active heading Award', () => {
      const event = { heading: 'Award' };
      component.onTabSelect(event);
      expect(component.preCommitment).toBe(false);
      expect(component.postCommitment).toBe(false);
      expect(component.award).toBe(true);
      expect(component.notesTab).toBe(false);
    });

    it('onTabSelect active heading Notes', () => {
      const event = { heading: 'Notes' };
      component.onTabSelect(event);
      expect(component.preCommitment).toBe(false);
      expect(component.postCommitment).toBe(false);
      expect(component.award).toBe(false);
      expect(component.notesTab).toBe(true);
    });
  });

});
