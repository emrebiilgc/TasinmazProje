import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { PropertyListComponent } from './pages/property-list/property-list.component';
import { PropertyAddComponent } from './pages/property-add/property-add.component';
import { PropertyEditComponent } from './pages/property-edit/property-edit.component';
import { UserListComponent } from './pages/user-list/user-list.component';
import { UserAddComponent } from './pages/user-add/user-add.component';
import { UserEditComponent } from './pages/user-edit/user-edit.component';
import { LogListComponent } from './pages/log-list/log-list.component';
import { LogDetailComponent } from './pages/log-detail/log-detail.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },

  { path: 'property-list', component: PropertyListComponent, canActivate: [AuthGuard], data: { roles: ['Admin','User'] } },
  { path: 'property-add', component: PropertyAddComponent, canActivate: [AuthGuard], data: { roles: ['User'] } },
  { path: 'property-edit/:id', component: PropertyEditComponent, canActivate: [AuthGuard], data: { roles: ['User'] } },

  { path: 'user-list', component: UserListComponent, canActivate: [AuthGuard], data: { roles: ['Admin'] } },
  { path: 'user-add', component: UserAddComponent, canActivate: [AuthGuard], data: { roles: ['Admin'] } },
  { path: 'user-edit/:id', component: UserEditComponent, canActivate: [AuthGuard], data: { roles: ['Admin'] } },

  { path: 'log-list', component: LogListComponent, canActivate: [AuthGuard], data: { roles: ['Admin'] } },
  { path: 'log-detail', component: LogDetailComponent, canActivate: [AuthGuard], data: { roles: ['Admin'] } },

  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
