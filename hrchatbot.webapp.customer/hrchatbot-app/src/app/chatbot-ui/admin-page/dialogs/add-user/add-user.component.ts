import {
  Component,
  OnInit,
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';
import {
  RepositoryService
} from 'src/app/shared/repository.service';
import {
  UserForCreation
} from 'src/app/_interface/userForCreation';
import {
  MatDialogRef,
  MatDialog
} from '@angular/material';
import {
  SuccessDialogComponent
} from 'src/app/shared/dialogs/success-dialog/success-dialog.component';
import {
  ErrorHandlerService
} from 'src/app/shared/error-handler.service';

@Component({
  selector: 'app-add-user',
  templateUrl: 'add-user.component.html',
  styleUrls: ['add-user.component.css']
})
export class AddUserComponent implements OnInit {
  public userForm: FormGroup;
  private dialogConfig;
  constructor(private repository: RepositoryService,
              private dialog: MatDialog,
              public dialogRef: MatDialogRef < AddUserComponent >,
              private errorService: ErrorHandlerService) {}

  ngOnInit() {
    this.userForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.maxLength(60)]),
      email: new FormControl('', [Validators.required, Validators.email]),
// tslint:disable-next-line: max-line-length
      password: new FormControl('', [Validators.required, Validators.pattern('^(?=[^a-z]*[a-z])(?=\\D*\\d)[A-Za-z\\d!$%@#£€*?&]{8,}$')]),
      isAdmin: new FormControl(false)
    });

  }

  public hasError = (controlName: string, errorName: string) => {
    return this.userForm.controls[controlName].hasError(errorName);
  }

  public onCancel = () => {
    this.dialogRef.close();
  }

  public createUser = (userFormValue) => {
    let user: UserForCreation = {
      name: userFormValue.name,
      email: userFormValue.email,
      password: userFormValue.password,
      isAdmin: userFormValue.isAdmin
    }
    if (this.userForm.valid) {
    this.repository.create(user)
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

}
