import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef} from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog } from '@angular/material';
import { User } from 'src/app/_interface/user.model';
import { RepositoryService } from 'src/app/shared/repository.service';
import { EditDialogComponent } from './dialogs/edit-user/edit-dialog.component';
import { AddUserComponent } from './dialogs/add-user/add-user.component';
import { DeleteUserComponent } from './dialogs/delete-user/delete-user.component';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit, AfterViewInit{
  public displayedColumns = ['id', 'name', 'email', 'isAdmin', 'update', 'delete'];

  public dataSource = new MatTableDataSource<User>();
  user;
  users: User[];
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  constructor(private repoService: RepositoryService, public dialog: MatDialog) { }

  ngOnInit() {
    this.getAllUsers();
    // this.refresh();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  refresh() {
    this.getAllUsers();
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  public getAllUsers = () => {
    this.repoService.getData()
    .subscribe(res => {
      const users = res.users;
      // const user = users[0];
      // this.dataSource = new MatTableDataSource(users);
      this.dataSource.data = users as User[];
      // this.dataSource.sort = this.sort;
      // this.dataSource.paginator = this.paginator;

     });
  };

  public addUser() {
    const dialogRef = this.dialog.open(AddUserComponent, {
      width: '680px',
      height: '430px'
    });
    dialogRef.afterClosed().subscribe(result => {
      this.refresh();
    });
  }

  public userEdit(element) {
    const dialogRef = this.dialog.open(EditDialogComponent, {
      height: '430px',
      width: '400px',
      data: element
    });

    dialogRef.afterClosed().subscribe(result => {
      this.refresh();
    });
  }

  public userDelete(element) {
     const dialogRef = this.dialog.open(DeleteUserComponent, {
       width: '650px',
       height: '380px',
       data: element
     });
     dialogRef.afterClosed().subscribe(result => {
      this.refresh();
    });
  }

}
