import { throwError as observableThrowError, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { environment } from '../environments/environment';
import { PlatformLocation, Location } from '@angular/common';
import { IAuthSettings } from './shared/models/auth-settings.model';
// TODO: remove this and replace with specific operators

@Injectable()
export class AppConfigService {
  public config: any = null;
  private _env: string;
  constructor(private http: HttpClient) {}
  public load(): Observable<any> {
    const env = environment.envName ? environment.envName : 'production';
    this._env = env;
    let envConfigFilePath = '';
    // let window: any;
    const location = window.location;
    let virtualDirec = location.pathname.substr(0, window.location.pathname.lastIndexOf('/'));
    if (virtualDirec !== '' && virtualDirec !== '/') {
      if (!virtualDirec.startsWith('/')) {
        virtualDirec = '/' + virtualDirec;
      }
      if (!virtualDirec.endsWith('/')) {
        virtualDirec = virtualDirec + '/';
      }
      envConfigFilePath = '../..' + virtualDirec + 'assets/configs/' + env + '.config.json';
    } else {
      envConfigFilePath = '../../assets/configs/' + env + '.config.json';
    }
    return this.http.get(envConfigFilePath).pipe(
      // .map(res => res.json())
      map(configData => {
        this.config = configData;
        return configData;
      }),
      catchError(error => {
        if (this.config.enableDebug) {
          console.error(error);
        }
        return observableThrowError(error.json().error || 'Server error');
      })
    );
  }
  getConfig(): Observable<{
    apiEndpointUrl: string;
  }> {
    if (this.config === null) {
      return this.load().pipe(
        map(config => {
          if (config.enableDebug) {
            console.log('Web Api         Endpoint:' + config.apiEndpointUrl);
          }
          return config;
        })
      );
    } else {
      return Observable.create(observer => {
        if (this.config.enableDebug) {
          console.log('Web Api Endpoint:' + this.config.apiEndpointUrl);
        }
        observer.next(this.config);
      });
    }
  }
}
