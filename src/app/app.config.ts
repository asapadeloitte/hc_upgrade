/*tslint:disable:no-inferrable-types*/

import { Observable, Observer } from 'rxjs';
import { map } from 'rxjs/operators';

import { ReflectiveInjector, Injectable, Injector } from '@angular/core';
import { IAuthSettings } from './shared/models/auth-settings.model';
import { XhrFactory } from '@angular/common';
import { HttpClient, HttpBackend, HttpXhrBackend, HttpHandler } from '@angular/common/http';
import { AppConfigService } from './app-config.service';

// @Injectable()
// class MyCookieXSRFStrategy extends CookieXSRFStrategy {
//   constructor() {
//     super(',');
//   }
// }

@Injectable()
export class MyBrowserXhr implements XhrFactory {
  constructor() {}
  build(): any { return (new XMLHttpRequest()) as any; }
}

@Injectable()
export class AppConfig {
  public apiEndpointUrl: string;
  public analyticsApiEndpointUrl: string;
  public authSettings: IAuthSettings;
  public tenantCode: string;
  private configLoaded = false;

  constructor() {}

  load(): Observable<any> {
    if (this.configLoaded) {
      return Observable.create(function(observer: Observer<any>) {
        observer.complete();
      });
    }

    const injector = Injector.create([
      { provide: XhrFactory, useClass: MyBrowserXhr, deps: [] },
      { provide: HttpHandler, useClass: HttpXhrBackend, deps: [XhrFactory] },
      { provide: HttpClient, useClass: HttpClient, deps: [HttpHandler] },
      { provide: AppConfigService, useClass: AppConfigService, deps: [HttpClient] }
    ]);
    // const injector2: any = ReflectiveInjector.resolveAndCreate([
    //   { provide: XhrFactory, useClass: BrowserXhr },
    //   { provide: HttpHandler, useClass: HttpXhrBackend },
    //   HttpClient,
    //   AppConfigService
    // ]);
    const configService: AppConfigService = injector.get(AppConfigService);
    // const configService = new AppConfigService(new HttpClient(new HttpXhrBackend(new BrowserXhr())));
    return configService.getConfig().pipe(map(config => {
      this.apiEndpointUrl = config.apiEndpointUrl;
      this.configLoaded = true;
      return config;
    }));
  }
}

