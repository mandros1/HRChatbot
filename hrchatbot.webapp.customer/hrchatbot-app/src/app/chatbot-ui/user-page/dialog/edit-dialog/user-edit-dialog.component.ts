import { Component, OnInit, Inject, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { User } from 'src/app/auth/user.model';
import { FormGroup, FormControl } from '@angular/forms';
import { NameDialogComponent } from '../name-dialog/name-dialog.component';
import { EmailDialogComponent } from '../email-dialog/email-dialog.component';
import { PasswordDialogComponent } from '../password-dialog/password-dialog.component';

@Component({
  selector: 'app-user-edit-dialog',
  templateUrl: './user-edit-dialog.component.html',
  // styleUrls: ['./reset-password.component.css']
})
export class UserEditDialogComponent implements OnInit {
  editForm: FormGroup;
  user: User;
  constructor( @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
               @Optional() public dialogRef: MatDialogRef<UserEditDialogComponent>,
               public dialog: MatDialog) { }

  ngOnInit() {
    this.editForm = new FormGroup({
      name: new FormControl({value: '', disabled: true}),
      email: new FormControl({value: '', disabled: true}),
    });
  }

  onNoClick() {
    sessionStorage.clear();
    this.dialogRef.close();
  }

  applyEdit() {
    const newUserName = sessionStorage.getItem('name');
    const newUserEmail = sessionStorage.getItem('email');
    console.log(newUserName + ' ' + newUserEmail);
  }

  nameDialog() {
    const dialogRef = this.dialog.open(NameDialogComponent, {
      width: '560px',
      height: '230px',
      data: JSON.parse(localStorage.getItem('userData'))
    });
    dialogRef.afterClosed().subscribe(result => {
        if (sessionStorage.getItem('name') !== null) {
          this.editForm.patchValue({
          name: JSON.parse(sessionStorage.getItem('name')),
        });
    }
    });
  }

  emailDialog() {
    const dialogRef = this.dialog.open(EmailDialogComponent, {
      width: '560px',
      height: '230px',
      data: JSON.parse(localStorage.getItem('userData'))
    });
    dialogRef.afterClosed().subscribe(result => {
      if(sessionStorage.getItem('email') !== null){
        this.editForm.patchValue({
          email: JSON.parse(sessionStorage.getItem('email'))
        });
      }
    });
  }

  passwordDialog() {
    const dialogRef = this.dialog.open(PasswordDialogComponent, {
      width: '520px',
      height: '430px'
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

}
