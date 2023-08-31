import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';


@Component({
  selector: 'px-logout',
  standalone: true,
  template: ''
})
export class LogoutComponent {
  constructor(
    authService: AuthService,
    router: Router,
  ) {
    authService.logout()
    router.navigate(['/'])
  }
}
