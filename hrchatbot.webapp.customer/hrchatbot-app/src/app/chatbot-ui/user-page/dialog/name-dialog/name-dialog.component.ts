import { Component, OnInit, Optional, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { UserEditDialogComponent } from '../edit-dialog/user-edit-dialog.component';

@Component({
  selector: 'app-name-dialog',
  templateUrl: './name-dialog.component.html',
  styleUrls: ['./name-dialog.component.css']
})
export class NameDialogComponent implements OnInit {
  nameForm: FormGroup;
  constructor( @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
               @Optional() public dialogRef: MatDialogRef<UserEditDialogComponent>,
               public dialog: MatDialog
               ) { }

  ngOnInit() {
    this.nameForm = new FormGroup({
      name: new FormControl(this.data.id, [Validators.required]),
    });
    if(sessionStorage.getItem('name') !== null){
      this.nameForm.patchValue({
        name: JSON.parse(sessionStorage.getItem('name'))
      });
    }
  }

  onNoClick() {
    this.dialogRef.close();
  }

  applyEdit = (nameFormValue) => {
    if (this.nameForm.valid) {
      this.data.id = nameFormValue.name;
      sessionStorage.setItem('name', JSON.stringify(nameFormValue.name));
      this.dialogRef.close();
    }
  }

}
