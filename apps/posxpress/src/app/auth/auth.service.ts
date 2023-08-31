import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { shareReplay, tap } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Role } from '@px/interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) {}

  login(username: string, password: string) {
    return this.http
      .post<{ access_token: string }>('/api/auth/login', { username, password })
      .pipe(
        tap((res) => this.setSession(res)),
        shareReplay()
      );
  }

  private setSession(authResult: { access_token: string }) {
    // const expiresAt = moment().add(authResult.expiresIn, 'second');

    localStorage.setItem('access_token', authResult.access_token);
  }

  logout() {
    localStorage.removeItem('access_token');
  }

  public isLoggedIn() {
    return !this.jwtHelper.isTokenExpired();
  }

  public getRoles(): Role[] {
    return this.jwtHelper.decodeToken().roles;
  }
  public getUser(): string {
    return this.jwtHelper.decodeToken().username;
  }

  getExpiration() {
    return this.jwtHelper.getTokenExpirationDate;
  }
}
