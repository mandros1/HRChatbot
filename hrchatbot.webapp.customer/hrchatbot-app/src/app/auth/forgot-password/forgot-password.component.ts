import { Component, OnInit } from '@angular/core';

import { FormGroup, FormControl, Validators } from '@angular/forms';

import { RepositoryService } from 'src/app/shared/repository.service';

import { MatDialog, MatDialogRef } from '@angular/material';

import { ErrorHandlerService } from 'src/app/shared/error-handler.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: 'forgot-password.component.html',
  styleUrls: ['forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  public emailForm: FormGroup;
  private dialogConfig;
  constructor(private repository: RepositoryService,
              private dialog: MatDialog,
              public dialogRef: MatDialogRef < ForgotPasswordComponent >,
              private errorService: ErrorHandlerService) {}

  ngOnInit() {
    this.emailForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    });

  }

  public hasError = (controlName: string, errorName: string) => {
    return this.emailForm.controls[controlName].hasError(errorName);
  }

  public onCancel = () => {
    this.dialogRef.close();
  }

  resetPasswordLink(email: string) {
    console.log(email);
  }

}
