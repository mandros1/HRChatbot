import { Component, OnInit, OnDestroy, Optional, Inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { UserEditDialogComponent } from '../chatbot-ui/user-page/dialog/edit-dialog/user-edit-dialog.component';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { User } from '../auth/user.model';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {
  changeColor = false;
  isAuthenticated = false;
  isAdmin = true;
  user: User;
  private userSub: Subscription;

  constructor(
    private authService: AuthService,
    public dialog: MatDialog,
    @Optional() public dialogRef: MatDialogRef<UserEditDialogComponent>
  ) {}

  ngOnInit() {
    this.userSub = this.authService.user.subscribe(user => {
      this.isAuthenticated = !!user;
    });
  }

  onLogout() {
    this.authService.logout();
  }

  editDialog(user) {
    const dialogRef = this.dialog.open(UserEditDialogComponent, {
      disableClose: true,
      width: '670px',
      height: '450px',
      data: JSON.parse(localStorage.getItem('userData'))
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}
