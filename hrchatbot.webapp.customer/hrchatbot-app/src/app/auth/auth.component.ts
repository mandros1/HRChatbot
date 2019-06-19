import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService, AuthResponseData, AuthData } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  //isLoginMode = true;
  isLoading = false;
  error: string = null;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    let authObs: Observable<any>;

    this.isLoading = true;

    //if (this.isLoginMode) {
      authObs = this.authService.login(email, password);
    //}
    //else {
    //   authObs = this.authService.signup(email, password);
    // }

    authObs.subscribe(
      resData => {
        const data = resData.data;
        this.isLoading = false;
         if (data.isAdmin === true) {
           this.router.navigate(['/admin-page']);
         } else {
           this.router.navigate(['/user-page']);
         }
      },
      errorMessage => {
        console.log(errorMessage);
        this.error = errorMessage;
        this.isLoading = false;
      }
    );

    form.reset();
  }
}
