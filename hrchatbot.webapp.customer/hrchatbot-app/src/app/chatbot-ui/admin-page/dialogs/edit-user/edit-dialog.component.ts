import { User } from 'src/app/_interface/user.model';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { RepositoryService } from 'src/app/shared/repository.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { SuccessDialogComponent } from 'src/app/shared/dialogs/success-dialog/success-dialog.component';
import { ErrorHandlerService } from 'src/app/shared/error-handler.service';
import { UserForUpdate } from 'src/app/_interface/userForUpdate';

@Component({
  selector: 'app-edit-dialog',
  templateUrl: 'edit-dialog.component.html',
})
export class EditDialogComponent implements OnInit{
 // user: User;
  editForm: FormGroup;
  private dialogConfig;

  constructor( public dialogRef: MatDialogRef<EditDialogComponent>,
               @Inject(MAT_DIALOG_DATA) public data: any,
               private dialog: MatDialog,
               private errorService: ErrorHandlerService,
               private repoService: RepositoryService) {}

  ngOnInit() {
    this.editForm = new FormGroup({
    name: new FormControl(this.data.name, [Validators.required, Validators.maxLength(60)]),
    email: new FormControl(this.data.email, [Validators.required, Validators.email]),
    //password: new FormControl(this.data.password, [Validators.required, Validators.pattern('^(?=[^a-z]*[a-z])(?=\\D*\\d)[A-Za-z\\d!$%@#£€*?&]{8,}$')]),
    isAdmin: new FormControl(this.data.isAdmin)
  });
    // this.repoService.getUserById(this.data.id)
    // .subscribe( data => {
    // });
  }

  public updateUser = (editFormValue) => {
    let userData: UserForUpdate = {
      name: editFormValue.name,
      email: editFormValue.email,
      // password: editFormValue.password,
      isAdmin: JSON.stringify(editFormValue.isAdmin)
    };
    if (this.editForm.valid) {
    this.repoService.update(this.data.id, userData)
        .subscribe( res => {
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

  onNoClick() {
    this.dialogRef.close();
  }
}
