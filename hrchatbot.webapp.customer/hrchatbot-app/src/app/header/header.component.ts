import { Component, OnInit, OnDestroy, Optional } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { UserEditDialogComponent } from '../chatbot-ui/user-page/dialog/edit-dialog/user-edit-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material';
import { User } from '../auth/user.model';
import { Router } from "@angular/router";

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
    private router: Router,
    @Optional() public dialogRef: MatDialogRef<UserEditDialogComponent>
  ) {}

  async ngOnInit() {
    await this.authService.isUserLoggedIn()
      .then(res => {
        let logged = res['isLoggedIn'];
        let admin = res['isAdmin'];
        if(logged && admin){
          this.router.navigate(['/admin-page']);
        } else if(logged && !admin){
          this.router.navigate(['/user-page']);
        }
      });
  }

  onLogout() {
    // this.isAuthenticated = false;
    this.authService.logout();
    this.isAuthenticated = false;
  }

  goToChat() {
    this.router.navigate(['/user-page']);
  }

  goToManageUsers() {
    this.router.navigate(['/admin-page']);
  }

  goToAnalytics() {
    this.router.navigate(['/analytics']);
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
