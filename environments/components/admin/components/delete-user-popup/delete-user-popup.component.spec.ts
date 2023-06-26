import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { User } from '../../../../shared/models/user.model';
import { DeleteUserPopupComponent } from './delete-user-popup.component';
import { NgBusyModule } from 'ng-busy';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA, SimpleChange } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterModule } from '@angular/router';
import { ApiEndpointsConfig } from 'src/app/app-api-endpoints.config';
import { HumanCapitalService } from 'src/app/shared/services/humanCapital.service';
import { SmartListConversionService } from 'src/app/shared/services/smartListConversion.service';
import { BsModalService, BsModalRef, ModalModule } from 'ngx-bootstrap/modal';
import { ToasterModule } from 'angular2-toaster';
import { NgSelectModule } from '@ng-select/ng-select';
import { SimpleChanges, OnChanges } from '@angular/core';
import { AdminService } from 'src/app/shared/services/admin.service';
import { of } from 'rxjs';


describe('DeleteUserPopupComponent', () => {
  let component: DeleteUserPopupComponent;
  let fixture: ComponentFixture<DeleteUserPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteUserPopupComponent],
      imports: [NgBusyModule,
        FormsModule, ReactiveFormsModule, HttpClientTestingModule,
        RouterModule.forRoot([]), ModalModule.forRoot(),
        ToasterModule.forRoot(), NgSelectModule],
      providers: [AuthService, ApiEndpointsConfig,
        HumanCapitalService, SmartListConversionService,
        BsModalRef, BsModalService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteUserPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Reset function', () => {
    xit('Reset Everything', () => {

      component.reset();
    });
  });

  describe('On Changes', () => {
    it('Call to ngOnChanges', () => {
      const eventDataChange: SimpleChange = new SimpleChange(null, 123, false);
      const simpleChanges: SimpleChanges = {
        userId: eventDataChange
      };
      component.ngOnChanges(simpleChanges);
      fixture.whenStable().then(() => {
        expect(component.ngOnChanges).toHaveBeenCalled();
      });
    });
  });
});
