/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { OneStaffService } from './one-staff.service';

describe('Service: OneStaff', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OneStaffService]
    });
  });

  it('should ...', inject([OneStaffService], (service: OneStaffService) => {
    expect(service).toBeTruthy();
  }));
});
