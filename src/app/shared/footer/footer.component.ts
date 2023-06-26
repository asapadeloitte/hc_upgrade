import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  yearData: number = new Date().getFullYear();
  constructor(private authService: AuthService) {
  }

  ngOnInit() {
   }

  onClickLogout() {
    localStorage.removeItem('currentUser');
    this.authService.jwt_logout();
  }
}
