import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthComponent } from './auth/auth.component';
import { AdminPageComponent } from './chatbot-ui/admin-page/admin-page.component';
import { UserPageComponent } from './chatbot-ui/user-page/user-page.component';
import { AuthGuard } from './auth/auth.guard';

const appRoutes: Routes = [
  { path: '', redirectTo: '/auth', pathMatch: 'full' },
  { path: 'admin-page', component: AdminPageComponent, canActivate: [AuthGuard] },
  { path: 'user-page', component: UserPageComponent, canActivate: [AuthGuard] },
 // { path: 'add', component: AddUserComponent},
  { path: 'auth', component: AuthComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
