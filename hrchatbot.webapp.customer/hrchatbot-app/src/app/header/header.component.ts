import { Component, OnInit, OnDestroy, Optional } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { UserEditDialogComponent } from '../chatbot-ui/user-page/dialog/edit-dialog/user-edit-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material';
import { User } from '../auth/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy{
  isAuthenticated = false;
  isAdmin = true;
  user: User;
  private userSub: Subscription;

  constructor(
    public authService: AuthService,
    public dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.authService.isUserLoggedIn()
      .then(res => {
        this.isAuthenticated = res;
      });
  }

  onLogout() {
    // this.isAuthenticated = false;
    this.authService.logout();
    this.isAuthenticated = false;
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
