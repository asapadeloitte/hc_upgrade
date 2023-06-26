import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';

declare var jQuery: any;
@Component({
  selector: '[logout]',
  styleUrls: ['./logout.component.scss'],
  templateUrl: './logout.template.html',
  encapsulation: ViewEncapsulation.None,
  // tslint:disable-next-line: no-host-metadata-property
  host: {
    class: 'login-page app'
  }
})

export class LogoutComponent implements OnInit {

  currentYear: string;

  constructor(

    private authService: AuthService,
  ) {

  }

  ngOnInit(): void {
    this.authService.jwt_logout();
  }

}
