import {AfterViewInit, Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService, AuthData } from './auth.service';
import { MatDialog } from '@angular/material';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import {RepositoryService} from "../shared/repository.service";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnChanges{
  isLoading = false;
  error: string = null;

  constructor(
              private authService: AuthService,
              private router: Router,
              public dialog: MatDialog,
              private repo: RepositoryService) {}


  async ngOnInit(){
    const data = JSON.parse(localStorage.getItem('userData'));
    if (data !== null && data !== undefined && data !== '') {
      const body = {
        auth_token: data['auth_token'],
        auth_token_valid_to: data['auth_token_valid_to']
      };

      let object = await this.repo.isLoggedIn(body);
      if (object['success']) {
        if (object['isAdmin']) {
          console.log("ADMIN");
          this.router.navigate(['/admin-page']);
        } else {
          console.log("NOT ADMIN");
          this.router.navigate(['/user-page']);
        }
      }
    }
  }


  async ngOnChanges(changes: SimpleChanges) {
    const data = JSON.parse(localStorage.getItem('userData'));
    if (data !== null && data !== undefined && data !== '') {
      const body = {
        auth_token: data['auth_token'],
        auth_token_valid_to: data['auth_token_valid_to']
      };

      let object = await this.repo.isLoggedIn(body);
      if (object['success']) {
        if (object['isAdmin']) {
          this.router.navigate(['/admin-page']);
        } else {
          this.router.navigate(['/user-page']);
        }
      }
    }
  }


  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    let authObs: Observable<AuthData>;

    this.isLoading = true;


    authObs = this.authService.login(email, password);
    this.authService.newLogin(email, password);

  console.log('OnSubmit called');
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

  forgotPassword() {
    console.log('Works');
    const dialogRef = this.dialog.open(ForgotPasswordComponent, {
      width: '450px',
      height: '280px'
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }


}
