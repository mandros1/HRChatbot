import { Component, OnInit, Optional, Inject, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective, FormBuilder, NgForm } from '@angular/forms';
import { User } from 'src/app/auth/user.model';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { UserEditDialogComponent } from '../edit-dialog/user-edit-dialog.component';
import { ErrorStateMatcher } from '@angular/material/core';
import { RepositoryService } from 'src/app/shared/repository.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
    const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);

    return (invalidCtrl || invalidParent);
  }
}

@Component({
  selector: 'app-password-dialog',
  templateUrl: './password-dialog.component.html',
  styleUrls: ['./password-dialog.component.css']
})
export class PasswordDialogComponent implements OnInit {
  passwordForm: FormGroup;
  user: User;
  matcher = new MyErrorStateMatcher();

  constructor( @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
               @Optional() public dialogRef: MatDialogRef<UserEditDialogComponent>,
               public dialog: MatDialog,
               private formBuilder: FormBuilder, private repository: RepositoryService) { }

  ngOnInit() {
    this.passwordForm = this.formBuilder.group({
// tslint:disable-next-line: max-line-length
      currentPassword: ['', [Validators.required, Validators.pattern('^(?=[^a-z]*[a-z])(?=\\D*\\d)[A-Za-z\\d!$%@#£€*?&]{8,}$')]],
// tslint:disable-next-line: max-line-length
      newPassword: ['', [Validators.required, Validators.pattern('^(?=[^a-z]*[a-z])(?=\\D*\\d)[A-Za-z\\d!$%@#£€*?&]{8,}$')]],
      confirmPassword: ['']
    }, { validator: this.check_pass });
  }

  onNoClick() {
    this.dialogRef.close();
  }

  applyEdit = (passwordFormValue) => {
    let reset: any = {
      password: passwordFormValue.confirmPassword,
      auth_token: JSON.stringify(localStorage.getItem('userData')),
    }
    if (this.passwordForm.valid) {
        this.repository.resetPassword(reset)
      .subscribe(res => {
          this.dialogRef.close();
         // let dialogRef = this.dialog.open(SuccessDialogComponent, this.dialogConfig);
      }
      );
    }
  }

  check_pass(group: FormGroup) {
    let pass = group.controls.newPassword.value;
    let confirmPass = group.controls.confirmPassword.value;

    return pass === confirmPass ? null : { notSame: true }
  }

}
