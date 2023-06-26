import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { NgBusyModule } from 'ng-busy';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterModule } from '@angular/router';
import { ApiEndpointsConfig } from 'src/app/app-api-endpoints.config';
import { HumanCapitalService } from 'src/app/shared/services/humanCapital.service';
import { SmartListConversionService } from 'src/app/shared/services/smartListConversion.service';
import { BsModalService, BsModalRef, ModalModule } from 'ngx-bootstrap/modal';
import { ToasterModule, ToasterService } from 'angular2-toaster';
import { NgSelectModule } from '@ng-select/ng-select';
import { GridApi, ColumnApi } from 'ag-grid-community';
import { AdminService } from 'src/app/shared/services/admin.service';
import { of } from 'rxjs';

describe('AdminDashboardComponent', () => {
  let component: AdminDashboardComponent;
  let fixture: ComponentFixture<AdminDashboardComponent>;
  let service: AdminService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdminDashboardComponent],
      imports: [NgBusyModule, FormsModule, ReactiveFormsModule, HttpClientTestingModule, RouterModule.forRoot([]), ModalModule.forRoot(),
      ToasterModule.forRoot(), NgSelectModule ],
      providers: [AuthService, ToasterService,
        ApiEndpointsConfig, HumanCapitalService, SmartListConversionService, BsModalRef, BsModalService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Reload Users function', () => {
    it('Refresh the call to get Users', () => {
      component.reloadUsers(true);
      fixture.whenStable().then(() => {
        expect(component.reloadUsers).toHaveBeenCalled();
      });
      expect(component.reloadUsers).toBeDefined();

    });
  });

  describe('Update the User', () => {
    it('Update User', () => {
      component.toaster = { pop: jasmine.createSpy() } as any;
      component.userUpdated(true);
      fixture.whenStable().then(() => {
        expect(component.userUpdated).toHaveBeenCalled();
      });
      expect(component.userUpdated).toBeDefined();
    });
  });
  describe('Delete User', () => {
    it('Delete Users', () => {
      component.toaster = { pop: jasmine.createSpy() } as any;
      component.userDeleted(true);
      fixture.whenStable().then(() => {
        expect(component.userDeleted).toHaveBeenCalled();
      });
      expect(component.userDeleted).toBeDefined();

    });
  });
  describe('Create User', () => {
    it('Create User', () => {
      component.toaster = { pop: jasmine.createSpy() } as any;
      component.userCreated(true);
      fixture.whenStable().then(() => {
        expect(component.userCreated).toHaveBeenCalled();
      });
      expect(component.userCreated).toBeDefined();

    });
  });
  describe('updateordeleteUser', () => {
    it('updateordeleteUser', () => {
      component.updateordeleteUser(Object);
      fixture.whenStable().then(() => {
        expect(component.updateordeleteUser).toHaveBeenCalled();
      });
      expect(component.updateordeleteUser).toBeDefined();
    });
  });

  describe('Load Users', () => {
    it('Load Users', () => {
      const data = [
        {
          email: 'admin@test.com',
          password: '{bcrypt}$2a$11$.9CuelX80pZHS/0kWN30d..dO8zrktalca75V2X9znaoot4DiI0D.',
          firstName: 'admin@test.com',
          lastName: 'admin@test.com',
          role: '',
          userId: 426,
          enabled: 'Y',
          emailAddress: 'admin@test.com',
          nativeUser: [
            'MOS - OCE'
          ]
        },
      ];
      service = TestBed.get(AdminService) as AdminService;
      spyOn(service, 'getUsers').and.returnValue(of(data));
      // tslint:disable-next-line: no-shadowed-variable
      service.getUsers().subscribe((data) => {
        expect(data).toBeDefined();
      });
      component.loadUsers();
      expect(component.loadUsers).toBeDefined();
    });
  });

  describe('Call Grid Ready', () => {
    it('onGridReady', () => {

      const params = {
        api: new GridApi(),
        ColumnApi: new ColumnApi(),
      };

      spyOn(component, 'onGridReady').and.callThrough();
      expect(component.onGridReady).toBeDefined();

    });
  });

});
