import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

function required(control: AbstractControl): ValidationErrors | null {
  return Validators.required(control) ? { required: true } : null;
}

@Component({
  selector: 'org-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  // Login form Username and Password
  loginForm = this.formBuilder.group({
    username: [sessionStorage.getItem('username') || '', required],
    password: ['', required],
  });
  hide = true; // If to hide the password or not

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  login() {
    const val = this.loginForm.value;

    if (val.username && val.password) {
      this.authService.login(val.username, val.password).subscribe(() => {
        let target = '/';
        this.activatedRoute.queryParams.subscribe((params: Params) => {
          target = params['redirectTo'] || target;
          this.router.navigateByUrl(target);
        });
      });
    }
  }
}
