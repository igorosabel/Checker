import { Injectable, inject } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserService } from '@services/user.service';
import { Observable, of } from 'rxjs';

@Injectable()
export class AuthService {
  us: UserService = inject(UserService);

  public isAuthenticated(): Observable<boolean> {
    this.us.loadLogin();
    if (!this.us.logged) {
      this.us.logout();
      return of(false);
    }
    if (this.us.user === null) {
      this.us.logout();
      return of(false);
    }
    const helper = new JwtHelperService();
    return of(!helper.isTokenExpired(this.us.user.token));
  }
}
