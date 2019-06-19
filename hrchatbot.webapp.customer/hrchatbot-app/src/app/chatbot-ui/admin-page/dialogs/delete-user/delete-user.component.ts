import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { RepositoryService } from 'src/app/shared/repository.service';
import { User } from 'src/app/_interface/user.model';
import { AdminPageComponent } from '../../admin-page.component';
import { SuccessDialogComponent } from 'src/app/shared/dialogs/success-dialog/success-dialog.component';
import {
  ErrorHandlerService
} from 'src/app/shared/error-handler.service';
@Component({
  selector: 'app-delete-user',
  templateUrl: 'delete-user.component.html',
  //styleUrls: ['delete-user.component.css']
})
export class DeleteUserComponent implements OnInit {

// tslint:disable-next-line: max-line-length
  constructor(private repository: RepositoryService,
              private dialog: MatDialog,
              private errorService: ErrorHandlerService,
              @Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<DeleteUserComponent>) { }

    private dialogConfig;
    public users: User[];
    public dataSource: AdminPageComponent;

  ngOnInit() {
    this.dialogConfig = {
      height: '200px',
      width: '400px',
      disableClose: true,
      data: {}
    };
  }

  public onCancel = () => {
    this.dialogRef.close();
  }

  public deleteUser(user: User): void {
    this.repository.deleteUser(user.id)
      .subscribe( data => {
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
