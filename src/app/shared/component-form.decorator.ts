import 'reflect-metadata';
import { FormGroup } from '@angular/forms';
import { HostListener, Directive, ElementRef, Attribute } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';

export const componentFormKey = Symbol('form');

export function ComponentForm(warnUnSavedChanges: boolean) {
  function f(target: any, key: string) {
    target[componentFormKey] = key;
    if (warnUnSavedChanges) {
      target['warnUnsavedChanges'] = function() {
        const fb = this[key] as FormGroup;
        if (fb != null) {
          return fb.pristine;
        }
      };
      Reflect.decorate(
        [HostListener('window:beforeunload')],
        target,
        'warnUnsavedChanges',
        Object.getOwnPropertyDescriptor(target, 'warnUnsavedChanges')
      );
    }
  }
  return f;
}

export function warnForUnsavedChanges(component: any): boolean {
  if (component[componentFormKey]) {
    const formGroup = component[component[componentFormKey]] as FormGroup;
    if (formGroup) {
      return formGroup.pristine
      ? true
      : // NOTE: this warning message will only be shown when navigating elsewhere within your angular app;
        // when navigating away from your angular app, the browser will show a generic warning message
        // see http://stackoverflow.com/a/42207299/7307355
        confirm(
          'WARNING: You have unsaved changes. Press Cancel to go back and save these changes, or OK to lose these changes.'
        );
    }
  } else if (component['canDeactivate']) {
    // if there are no pending changes, just allow deactivation; else confirm first
    return component.canDeactivate()
      ? true
      : // NOTE: this warning message will only be shown when navigating elsewhere within your angular app;
        // when navigating away from your angular app, the browser will show a generic warning message
        // see http://stackoverflow.com/a/42207299/7307355
        confirm(
          'WARNING: You have unsaved changes. Press Cancel to go back and save these changes, or OK to lose these changes.'
        );
  }
  return true;
}

