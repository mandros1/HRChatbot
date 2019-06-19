import { Component, OnInit, Optional, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { UserEditDialogComponent } from '../edit-dialog/user-edit-dialog.component';

@Component({
  selector: 'app-email-dialog',
  templateUrl: './email-dialog.component.html',
  styleUrls: ['./email-dialog.component.css']
})
export class EmailDialogComponent implements OnInit {
  emailForm: FormGroup;
  constructor( @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
               @Optional() public dialogRef: MatDialogRef<UserEditDialogComponent>,
               public dialog: MatDialog) { }

  ngOnInit() {
    this.emailForm = new FormGroup({
      email: new FormControl(this.data.email, [Validators.required, Validators.email]),
    });
    if(sessionStorage.getItem('email') !== null){
      this.emailForm.patchValue({
        email: JSON.parse(sessionStorage.getItem('email'))
      });
    }
  }

  onNoClick() {
    this.dialogRef.close();
  }

  applyEdit = (emailFormValue) => {
    if (this.emailForm.valid) {
      this.data.id = emailFormValue.email;
      sessionStorage.setItem('email', JSON.stringify(emailFormValue.email));
      this.emailForm.patchValue({
        email: JSON.parse(sessionStorage.getItem('email'))
      });
      this.dialogRef.close();
    }
  }
}
