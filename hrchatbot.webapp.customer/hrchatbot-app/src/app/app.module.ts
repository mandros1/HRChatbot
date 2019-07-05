import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthComponent } from './auth/auth.component';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { AuthInterceptorService } from './auth/auth-interceptor.service';
import { AdminPageComponent } from './chatbot-ui/admin-page/admin-page.component';
import { UserPageComponent } from './chatbot-ui/user-page/user-page.component';
import { HeaderComponent } from './header/header.component';
import { DropdownDirective } from './shared/dropdown.directive';
import { ChatColorDirective } from './shared/chat-color/chat-color.directive';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RepositoryService } from './shared/repository.service';
import { EditDialogComponent } from './chatbot-ui/admin-page/dialogs/edit-user/edit-dialog.component';
import { AddUserComponent } from './chatbot-ui/admin-page/dialogs/add-user/add-user.component';
import { DeleteUserComponent } from './chatbot-ui/admin-page/dialogs/delete-user/delete-user.component';
import { SuccessDialogComponent } from './shared/dialogs/success-dialog/success-dialog.component';
import { ErrorDialogComponent } from './shared/dialogs/error-dialog/error-dialog.component';
import { ErrorHandlerService } from './shared/error-handler.service';
import { UserEditDialogComponent } from './chatbot-ui/user-page/dialog/edit-dialog/user-edit-dialog.component';
import { NameDialogComponent } from './chatbot-ui/user-page/dialog/name-dialog/name-dialog.component';
import { EmailDialogComponent } from './chatbot-ui/user-page/dialog/email-dialog/email-dialog.component';
import { PasswordDialogComponent } from './chatbot-ui/user-page/dialog/password-dialog/password-dialog.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    DropdownDirective,
    ChatColorDirective,
    AuthComponent,
    LoadingSpinnerComponent,
    AdminPageComponent,
    UserPageComponent,
    EditDialogComponent,
    AddUserComponent,
    DeleteUserComponent,
    SuccessDialogComponent,
    ErrorDialogComponent,
    UserEditDialogComponent,
    NameDialogComponent,
    EmailDialogComponent,
    PasswordDialogComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    MaterialModule,
    FlexLayoutModule
  ],
  providers: [
    RepositoryService,
    ErrorHandlerService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: [EditDialogComponent,
                    AddUserComponent,
                    DeleteUserComponent,
                    SuccessDialogComponent,
                    ErrorDialogComponent,
                    UserEditDialogComponent,
                    NameDialogComponent,
                    EmailDialogComponent,
                    PasswordDialogComponent,
                    ForgotPasswordComponent
                   ]
})
export class AppModule {}
