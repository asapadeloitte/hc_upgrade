import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { User } from '../../../../shared/models/user.model';
import { UpdateUserPopupComponent } from './update-user-popup.component';
import { NgBusyModule } from 'ng-busy';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA, SimpleChange, SimpleChanges } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterModule } from '@angular/router';
import { ApiEndpointsConfig } from 'src/app/app-api-endpoints.config';
import { BsModalService, BsModalRef, ModalModule } from 'ngx-bootstrap/modal';
import { ToasterModule, ToasterService } from 'angular2-toaster';
import { NgSelectModule } from '@ng-select/ng-select';
import { AdminService } from 'src/app/shared/services/admin.service';
import { of, throwError } from 'rxjs';

describe('UpdateUserPopupComponent', () => {
  let component: UpdateUserPopupComponent;
  let service: AdminService;

  let fixture: ComponentFixture<UpdateUserPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateUserPopupComponent],
      imports: [NgBusyModule, FormsModule, ReactiveFormsModule,
        HttpClientTestingModule, RouterModule.forRoot([]), ModalModule.forRoot(),
        ToasterModule.forRoot(), NgSelectModule],
      providers: [AuthService, AdminService, ToasterService,
        ApiEndpointsConfig, BsModalRef, BsModalService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateUserPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Update User', () => {
    expect(component).toBeTruthy();
  });

  describe('update User function', () => {
    it('Update user Success', () => {
      const role = 'MOS-OCD';
      const user = new User();
      user.firstName = 'Ishani';
      user.lastName = 'Ved';
      user.email = 'ishani.ved';
      user.emailAddress = 'ishani.ved@gmail.com';
      user.nativeUser = [];
      user.nativeUser.push(role);
      service = TestBed.get(AdminService) as AdminService;
      spyOn(service, 'updateUser').and.returnValue(of({}));
      service.updateUser(user).subscribe((res) => {
        expect(res).toBeDefined();
      });
      component.updateUser(user);
      expect(component).toBeDefined();
    });
  });

  describe('update User function', () => {
    xit('Update user Fail', () => {
      const role = 'MOS-OCD';
      const user = new User();
      user.firstName = 'Ishani';
      user.lastName = 'Ved';
      user.email = 'ishani.ved';
      user.emailAddress = 'ishani.ved@gmail.com';
      user.nativeUser = [];
      user.nativeUser.push(role);
      service = TestBed.get(AdminService) as AdminService;
      spyOn(service, 'updateUser').and.returnValue(throwError('Errorr happened'));
      service.updateUser(user).subscribe((error) => {
        expect(error).toBeDefined();
      });
      component.updateUser(user);
      expect(component).toBeDefined();
    });

  });
  describe('Reset function', () => {
    it('Reset the popup when clicked on cancelled', () => {
      component.reset();
      expect(component.reset).toBeDefined();
    });
  });

  describe('TrackChanges function', () => {
    it('Tracks change', () => {
      component.trackChanges('');
      expect(component.trackChanges).toBeDefined();
    });
  });
  describe('Native User Description function', () => {
    it('gets all Native Descriptions', () => {

      service = TestBed.get(AdminService) as AdminService;
      spyOn(service, 'getUserGroups').and.returnValue(of({}));
      service.getUserGroups().subscribe((data) => {
        expect(data).toBeDefined();
      });
      component.getUserGroups();

    });
  });


  describe('Initialize the Component', () => {
    it('Initialize ngonit method', () => {
      component.ngOnInit();
      expect(component.ngOnInit).toBeDefined();
    });
  });

  describe('On Changes', () => {
    it('should call ngOnChanges function', () => {

      const role = 'MOS-OCD';
      const userObj = new User();
      userObj.firstName = 'Ishani';
      userObj.lastName = 'Ved';
      userObj.email = 'ishani.ved';
      userObj.emailAddress = 'ishani.ved@gmail.com';
      userObj.nativeUser = [];
      userObj.nativeUser.push(role);
      const eventDataChange: SimpleChange = new SimpleChange(null, userObj, false);
      const simpleChanges: SimpleChanges = {
        userObj: eventDataChange
      };

      component.ngOnChanges(simpleChanges);
      fixture.whenStable().then(() => {
        expect(component.ngOnChanges).toHaveBeenCalled();
      });

    });
  });

});
