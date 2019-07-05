import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';

import { User } from './user.model';
import {RepositoryService} from "../shared/repository.service";
// export interface AuthResponseData {
//   kind: string;
//   idToken: string;
//   email: string;
//   refreshToken: string;
//   expiresIn: string;
//   localId: string;
//   registered?: boolean;
// }

export interface AuthData {
  id: number;
  name: string;
  email: string;
  isAdmin: boolean;
  password: string;
  salt: string;
  auth_token: string;
  auth_token_valid_to: number;
  data: any;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;
  private readonly API = 'http://localhost:3000/api/v1';
  public isAuthenticated;
  public isAdmin;

  constructor(private http: HttpClient, private router: Router, private repo: RepositoryService) {}


  // TODO: remove this login
  login(email: string, password: string) {
    return this.http.put<AuthData>(this.API + '/login', {
      email: email,
      password: password
    })
    .pipe(
        catchError(this.handleError),
        tap(resData => {

        })
      );
  }

  newLogin(email: string, password: string, isChecked: boolean) {
    return this.repo.login({email: email, password: password})
      .subscribe(res => {
        this.handleAuthentication(
          res.data.auth_token,
          res.data.auth_token_valid_to,
          res.data.isAdmin,
          isChecked
        );
      });
  }

  // async isUserLoggedIn() {
    // const data = JSON.parse(localStorage.getItem('userData'));
    // if (data !== null && data !== undefined && data !== '') {
    //   const body = {
    //     auth_token: data['auth_token'],
    //     auth_token_valid_to: data['auth_token_valid_to']
    //   };
    //
    //   let object = await this.repo.isLoggedIn(body);
    //   console.log("RETURNED OBJECT FROM LOG:");
    //   console.log(object);
    //   if (object['success']) {
    //     if (object['isAdmin']) {
    //       this.router.navigate(['/admin-page']);
    //     } else {
    //       this.router.navigate(['/user-page']);
    //     }
    //   }
    //   return object;
    // }
  // }


  //TODO: change so that isLogged in returns isAdmin as well so that we can use that in the auth.component.ts
  // autoLogin() {
  //   const data = JSON.parse(localStorage.getItem('userData'));
  //   if (data !== null && data !== undefined && data !== '') {
  //
  //     const body = {
  //       auth_token: data['auth_token'],
  //       auth_token_valid_to: data['auth_token_valid_to']
  //     };
  //
  //     console.log('before repo call');
  //
  //     await this.repo.isLoggedIn(body)
  //       .subscribe(res => {
  //         let obj = {};
  //         console.log(`Success: ${res['success']} and admin: ${res['isAdmin']}`);
  //         if (res['success']) {
  //           console.log('Succeded')
  //           obj = {
  //             isLoggedIn: res['success'],
  //             isAdmin: res['isAdmin']
  //           };
  //         } else {
  //           obj = {
  //             isLoggedIn: false,
  //             isAdmin: false
  //           };
  //         }
  //         return obj;
  //       });
  //     console.log('after repo call')
  //   }
  // }


  // TODO: change this to check the
  isLoggedIn() {
    let data = localStorage.getItem('userData');
    return data !== null && data !== '';
  }

  async isUserLoggedIn() {
    let data = localStorage.getItem('userData');
    if (data !== null && data !== undefined && data !== '') {
      let token = JSON.parse(data)['auth_token'];
      let validity = parseInt(JSON.parse(data)['auth_token_valid_to']);

      const body = {
        auth_token: token,
        auth_token_valid_to: validity
      };

      let object = await this.repo.isLoggedIn(body);

      if (object['success']) this.isAuthenticated = true;
      else                  this.isAuthenticated = false;

      if (object['isAdmin']) this.isAdmin = true;
      else                  this.isAdmin = false;

      return object['success']
    }
    return false;
  }


  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
    this.isAuthenticated = false;
    this.isAdmin = false;
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
    this.isAuthenticated = false;
    this.isAdmin = false;
  }

  private handleAuthentication(
                                auth_token: string,
                                auth_token_valid_to: number,
                                isAdmin,
                                isChecked) {

    const expiresIn = 1800000;

    const user = new User(auth_token, auth_token_valid_to);
    this.user.next(user);

    this.autoLogout(expiresIn);

    let jsonData = {
      auth_token: auth_token,
      auth_token_valid_to: auth_token_valid_to
    };

    this.isAuthenticated = true;
    this.isAdmin = isAdmin;

    console.log(`Handle auth ${this.isAuthenticated} and admin: ${this.isAdmin}`);
    if(isChecked){
      localStorage.setItem('userData', JSON.stringify(jsonData));
    }
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email exists already';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This email does not exist.';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'This password is not correct.';
        break;
    }
    return throwError(errorMessage);
  }

  resetPasswordLink(body) {
    return this.http.post(this.API + '/resetPasswordLink', body, this.generateHeaders());
  }

  resetPassword(userHash, body) {
    return this.http.put(this.API + '/reset/' + userHash, body, this.generateHeaders());
  }

  private generateHeaders() {
    return {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    }
  }
}


