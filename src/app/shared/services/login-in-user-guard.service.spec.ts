import { TestBed } from '@angular/core/testing';

import { LoggedInUserGuard } from './login-in-user-guard.service';
import { AppModule } from 'src/app/app.module';
import { ActivatedRouteSnapshot } from '@angular/router';

describe('LoggedInUserGuard', () => {
    let service: LoggedInUserGuard;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AppModule]
        });
        service = TestBed.get(LoggedInUserGuard);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    // describe('canActivate function', () => {
    //     const state = { url: '/login' };
    //     const route = {
    //         params: 'uel',
    //         queryParams: 'uel',
    //         fragment: '23',

    //     };
    //     it('canActivate should be defined', () => {
    //       service.canActivate(route, state);
    //     });
    // });

});
