import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ErrorHandlerService } from 'src/app/shared/error-handler.service';
import { AuthService } from '../auth.service';
import { SuccessDialogComponent } from 'src/app/shared/dialogs/success-dialog/success-dialog.component';

@Component({
  selector: 'app-forgot-password',
  templateUrl: 'forgot-password.component.html',
  styleUrls: ['forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  public emailForm: FormGroup;
  private dialogConfig;
  constructor(private repository: AuthService,
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

  resetPasswordLink(email) {
    console.log(email);
    this.repository.resetPasswordLink(email)
    .subscribe(res => {
      this.dialogRef.close();
      let dialogRef = this.dialog.open(SuccessDialogComponent, this.dialogConfig);
    },
    (error => {
      this.errorService.dialogConfig = {
        ...this.dialogConfig
      };
      this.errorService.handleError(error);
    })
  );
  }

}
