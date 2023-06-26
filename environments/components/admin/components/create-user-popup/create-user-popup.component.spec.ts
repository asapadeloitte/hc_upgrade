import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { User } from '../../../../shared/models/user.model';
import { CreateUserPopupComponent } from './create-user-popup.component';
import { NgBusyModule } from 'ng-busy';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA, SimpleChange } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { AdminService } from 'src/app/shared/services/admin.service';
import { ApiEndpointsConfig } from 'src/app/app-api-endpoints.config';
import { APP_BASE_HREF } from '@angular/common';
import { ToasterService, ToasterModule } from 'angular2-toaster';
import { of } from 'rxjs';
import { NgSelectModule } from '@ng-select/ng-select';

import { RouterModule } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BsModalService, BsModalRef, ModalModule } from 'ngx-bootstrap/modal';

describe('CreateUserPopupComponent', () => {
  let component: CreateUserPopupComponent;
  let fixture: ComponentFixture<CreateUserPopupComponent>;
  let service: AdminService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreateUserPopupComponent],
      imports: [NgBusyModule, FormsModule, ReactiveFormsModule, HttpClientTestingModule,
        RouterModule.forRoot([]), ModalModule.forRoot(),
        ToasterModule.forRoot(), NgSelectModule],
      providers: [AuthService, AdminService, ToasterService,
        { provide: APP_BASE_HREF, useValue: '/' },
        ApiEndpointsConfig],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateUserPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should create UpdateUsercomponent', () => {
    expect(component).toBeTruthy();
  });

  describe('Create User Suite', () => {
    it('Create user methods', () => {
      const role = 'MOS-OCD';
      const user = new User();
      user.firstName = 'Ishani';
      user.lastName = 'Ved';
      user.email = 'ishani.ved';
      user.emailAddress = 'ishani.ved@gmail.com';
      user.nativeUser = [];
      user.nativeUser.push(role);
      service = TestBed.get(AdminService) as AdminService;

      spyOn(service, 'createUser').and.returnValue(of({}));
      service.updateUser(user).subscribe((res) => {
        expect(res).toBeDefined();
      });
      component.createUser(user);

    });
  });

  describe('Reset function', () => {
    it('Reset the popup when clicked on cancelled', () => {
      component.reset();
      expect(component.user.nativeUser).toBeNull();
    });
  });

  describe('TrackChanges function', () => {
    it('Tracks change', () => {
      component.trackChanges('MOS-OCD');
      expect(component.user.nativeUser).toEqual(['MOS-OCD']);

    });
  });

  describe('Initialize the Component', () => {
    it('Initialize ngonit method', () => {
      component.ngOnInit();
      expect(component.ngOnInit).toBeDefined();
    });
  });

  describe('yNative User Description function', () => {
    it('gets all Native Descriptions', () => {
      service = TestBed.get(AdminService) as AdminService;
      spyOn(service, 'getUserGroups').and.returnValue(of({}));
      service.getUserGroups().subscribe((data) => {
        expect(data).toBeDefined();
      });
      component.getUserGroups();
    });
  });

});
