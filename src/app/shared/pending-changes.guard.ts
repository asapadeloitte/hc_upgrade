import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import { warnForUnsavedChanges } from './component-form.decorator';

// export interface ComponentCanDeactivate {
//   canDeactivate: () => boolean | Observable<boolean>;
// }

@Injectable()
export class PendingChangesGuard implements CanDeactivate<any> {
  canDeactivate(component: any): boolean | Observable<boolean> {
    return warnForUnsavedChanges(component);
  }
}
