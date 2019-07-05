import { Component, OnInit, } from '@angular/core';
import { AuthService } from '../auth.service';
import { MatDialog } from '@angular/material';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { User } from '../user.model';
import { MyErrorStateMatcher } from 'src/app/chatbot-ui/user-page/dialog/password-dialog/password-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { SuccessDialogComponent } from 'src/app/shared/dialogs/success-dialog/success-dialog.component';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit{
  private dialogConfig;
  passwordForm: FormGroup;
  private dialogConfig;
  matcher = new MyErrorStateMatcher();

  constructor(private route: ActivatedRoute, private formBuilder: FormBuilder, private repository: AuthService, public dialog: MatDialog) { }

  ngOnInit() {
    //console.log(JSON.parse(localStorage.getItem('userData')).auth_token);
    this.passwordForm = this.formBuilder.group({
// tslint:disable-next-line: max-line-length
      newPassword: ['', [Validators.required, Validators.pattern('^(?=[^a-z]*[a-z])(?=\\D*\\d)[A-Za-z\\d!$%@#£€*?&]{8,}$')]],
      confirmPassword: ['']
    }, { validator: this.check_pass });
  }

  applyEdit = (passwordFormValue) => {
    let reset: any = {
      password: passwordFormValue.confirmPassword,
    };
    if (this.passwordForm.valid) {
// tslint:disable-next-line: max-line-length
        const param = this.route.snapshot.params;
        const userHash = param.userHash;
        this.repository.resetPassword(userHash, reset)
      .subscribe(res => {
        console.log(userHash);
         let dialogRef = this.dialog.open(SuccessDialogComponent, this.dialogConfig);
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
