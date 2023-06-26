import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './shared/services/auth.service';
import { ApiEndpointsConfig } from './app-api-endpoints.config';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HumanCapitalService } from './shared/services/humanCapital.service';
import { AppConfigService } from './app-config.service';
import { combineAll } from 'rxjs/operators';

describe('AppConfigService', () => {
  let service: ApiEndpointsConfig;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        ModalModule.forRoot(),
        NgIdleKeepaliveModule.forRoot(),
        HttpClientModule
      ],
      declarations: [
        AppComponent
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      providers: [AppConfigService, ApiEndpointsConfig, HumanCapitalService]
    }).compileComponents();
  }));

  beforeEach(() => {
    service = TestBed.get(ApiEndpointsConfig);
});

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });


  it(`getLoginUrl`, () => {
    service.getLoginUrl();
    expect(service.getLoginUrl).toBeDefined();
  });

  it(`getUserByEmailUrl`, () => {
    service.getUserByEmailUrl();
    expect(service.getUserByEmailUrl).toBeDefined();
  });

  it(`getAuthTokenUrl`, () => {
    service.getAuthTokenUrl();
    expect(service.getAuthTokenUrl).toBeDefined();
  });

});
