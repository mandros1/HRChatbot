import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';

import { User } from './user.model';
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
  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string) {
    return this.http.put<AuthData>(this.API + '/login', {
      email: email,
      password: password,
      returnSecureToken: true
    })
    .pipe(
        catchError(this.handleError),
        tap(resData => {
          this.handleAuthentication(
            email,
            resData.data.auth_token,
            +resData.auth_token_valid_to
          );
        })
      );
  }

    autoLogin() {
    const userData: {
      email: string;
      auth_token: string;
      auth_token_valid_to: string;
    } = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return;
    }

    const loadedUser = new User(
      userData.email,
      userData.auth_token,
      new Date(userData.auth_token_valid_to)
    );

    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expirationDuration =
        new Date(userData.auth_token_valid_to).getTime() -
        new Date().getTime();
      this.autoLogout(expirationDuration);
    }
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
    email: string,
    auth_token: string,
    auth_token_valid_to: number
  ) {
    const expiresIn = 1800000;
    const expirationDate = new Date(new Date().getTime() + expiresIn);
    const user = new User(email, auth_token, expirationDate);
    this.user.next(user);
    console.log(user);
    this.autoLogout(expiresIn);
    localStorage.setItem('userData', JSON.stringify(user));
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
}

  // signup(email: string, password: string) {
  //  return this.http.post(this.API + '/register', Users );
  //   return this.http
  //     .post<AuthResponseData>(
  //       'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyCc0jEhXCSHSfz42FxW_KujgbQF4hmByaM',
  //       {
  //         email: email,
  //         password: password,
  //         returnSecureToken: true
  //       }
  //     )
  //     .pipe(
  //       catchError(this.handleError),
  //       tap(resData => {
  //         this.handleAuthentication(
  //           resData.email,
  //           resData.localId,
  //           resData.idToken,
  //           +resData.expiresIn
  //         );
  //       })
  //     );
  // }

//   login(email: string, password: string) {
//     // return this.http.put<AuthData>(this.API + '/login', {
//     //   email: email,
//     //   password: password
//     // })
//     return this.http
//       .post<AuthResponseData>(
//         'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyCRhZAxAaOdLF5KSmRLPkoGEQl4cMbKdyk',
//         {
//           email: email,
//           password: password,
//           returnSecureToken: true
//         }
//       )
//       .pipe(
//         catchError(this.handleError),
//         tap(resData => {
//           this.handleAuthentication(
//             resData.email,
//             resData.localId,
//             resData.idToken,
//             +resData.expiresIn
//           );
//         })
//       );
//       //  .pipe(
//       //    catchError(this.handleError),
//       //    tap(resData => {

//       //      this.handleAuthentication(
//       //        resData.isAdmin,
//       //        resData.password,
//       //        resData.salt,
//       //        resData.email,
//       //        resData.name,
//       //        resData.id,
//       //        resData.auth_token,
//       //        +resData.auth_token_valid_to
//       //      );
//       //    })
//       //  );
//   }

//   autoLogin() {
//     const userData: {
//       id: number;
//       name: string;
//       email: string;
//       isAdmin: boolean;
//       password: string;
//       salt: string;
//       auth_token: string;
//       auth_token_valid_to: Date;
//     } = JSON.parse(localStorage.getItem('userData'));
//     if (!userData) {
//       return;
//     }

//     const loadedUser = new User(
//       userData.id,
//       userData.name,
//       userData.email,
//       userData.isAdmin,
//       userData.password,
//       userData.salt,
//       userData.auth_token,
//       new Date(userData.auth_token_valid_to)
//     );

//     if (loadedUser.token) {
//       this.user.next(loadedUser);
//       const expirationDuration =
//         new Date(userData.auth_token_valid_to).getTime() -
//         new Date().getTime();
//       this.autoLogout(expirationDuration);
//     }
//   }

//   logout() {
//     this.user.next(null);
//     this.router.navigate(['/auth']);
//     localStorage.removeItem('userData');
//     if (this.tokenExpirationTimer) {
//       clearTimeout(this.tokenExpirationTimer);
//     }
//     this.tokenExpirationTimer = null;
//   }

//   autoLogout(expirationDuration: number) {
//     this.tokenExpirationTimer = setTimeout(() => {
//       this.logout();
//     }, expirationDuration);
//   }

//   private handleAuthentication(
//     id: number,
//     name: string,
//     email: string,
//     isAdmin: boolean,
//     password: string,
//     salt: string,
//     auth_token: string,
//     auth_token_valid_to: number
//   ) {
//     const expirationDate = new Date(new Date().getTime() + auth_token_valid_to * 1000);
//     const user = new User(id, name, email, isAdmin, password, salt, auth_token, expirationDate);
//     this.user.next(user);
//     this.autoLogout(auth_token_valid_to * 1000);
//     localStorage.setItem('userData', JSON.stringify(user));
//   }

//   private handleError(errorRes: HttpErrorResponse) {
//     let errorMessage = 'An unknown error occurred!';
//     if (!errorRes.error || !errorRes.error.error) {
//       return throwError(errorMessage);
//     }
//     switch (errorRes.error.error.message) {
//       // case 'EMAIL_EXISTS':
//       //   errorMessage = 'This email exists already';
//       //   break;
//       case 'EMAIL_NOT_FOUND':
//         errorMessage = 'This email does not exist.';
//         break;
//       case 'INVALID_PASSWORD':
//         errorMessage = 'This password is not correct.';
//         break;
//     }
//     return throwError(errorMessage);
//   }

