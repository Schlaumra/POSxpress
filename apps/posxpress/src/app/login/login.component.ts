import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ValidationErrors,
  Validators,
} from '@angular/forms';

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
  ) {}

  login() {
    console.log("TODO")
  }

} 
