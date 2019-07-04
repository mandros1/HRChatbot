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

  constructor(private http: HttpClient, private router: Router, private repo: RepositoryService) {}

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

  newLogin(email: string, password: string) {
    // let admin = '';
    return this.repo.login({email: email, password: password})
      .subscribe(res => {
        this.handleAuthentication(
          res.data.auth_token,
          res.data.auth_token_valid_to,
          res.data.isAdmin
        );
      });
  }

  // apiLogin()

    autoLogin() {
      const data = JSON.parse(localStorage.getItem('userData'));
      if(data !== null && data !== undefined && data !== ''){

        const body = {
          auth_token: data['auth_token'],
          auth_token_valid_to: data['auth_token_valid_to']
        };

        this.repo.isLoggedIn(body)
          .subscribe(res => {
            return  res['success'];
            // const success = res.success;
            // if(success) {
            //
            //   // let jsonData = {
            //   //   auth_token: auth_token,
            //   //   auth_token_valid_to: auth_token_valid_to
            //   // };
            //   //
            //   // localStorage.setItem('userData', JSON.stringify(jsonData));
            //   //
            //   // localStorage.setItem()
            // }
          });

      }
    // const userData: {
    //   email: string;
    //   auth_token: string;
    //   auth_token_valid_to: string;
    // } = JSON.parse(localStorage.getItem('userData'));
    // if (!userData) {
    //   return;
    // }


    //
    //
    //
    // const loadedUser = new User(
    //   userData.email,
    //   userData.auth_token,
    //   new Date(userData.auth_token_valid_to)
    // );
    //
    // if (loadedUser.token) {
    //   this.user.next(loadedUser);
    //   const expirationDuration =
    //     new Date(userData.auth_token_valid_to).getTime() -
    //     new Date().getTime();
    //   this.autoLogout(expirationDuration);
    // }
  }

  // login(email: string, password: string) {
  //   return this.http
  //     .post<AuthResponseData>(
  //       'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyCRhZAxAaOdLF5KSmRLPkoGEQl4cMbKdyk',
  //       {
  //         email: email,
  //         password: password,
  //         returnSecureToken: true
  //       }
  //     )
      // .pipe(
      //   catchError(this.handleError),
      //   tap(resData => {
      //     this.handleAuthentication(
      //       resData.email,
      //       resData.localId,
      //       resData.idToken,
      //       +resData.expiresIn
      //     );
      //   })
      // );
  // }

  isLoggedIn() {
    let data = localStorage.getItem('userData');
    return data !== null && data !== '';
  }


  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private handleAuthentication(
    auth_token: string,
    auth_token_valid_to: number,
    isAdmin
  ) {
    console.log(auth_token);
    console.log(auth_token_valid_to);
    const expiresIn = 1800000;
    // const expirationDate = new Date(new Date().getTime() + expiresIn);
    const user = new User(auth_token, auth_token_valid_to);
    this.user.next(user);
    // console.log(user);
    this.autoLogout(expiresIn);

    let jsonData = {
      auth_token: auth_token,
      auth_token_valid_to: auth_token_valid_to
    };

    localStorage.setItem('userData', JSON.stringify(jsonData));
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


