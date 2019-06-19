import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// tslint:disable-next-line: max-line-length
import { MatTableModule, MatSortModule, MatFormFieldModule, MatInputModule, MatPaginatorModule, MatDialogModule, MAT_DIALOG_DATA, MatToolbarModule, MatCardModule, MatCheckboxModule } from '@angular/material';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatDialogModule,
    MatToolbarModule,
    MatCardModule,
    MatCheckboxModule
  ],
  exports: [
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatDialogModule,
    MatToolbarModule,
    MatCardModule,
    MatCheckboxModule
  ],
})
export class MaterialModule { }
