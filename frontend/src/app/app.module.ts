import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { PropertyListComponent } from './pages/property-list/property-list.component';

import { AuthInterceptor } from './services/auth.interceptor';
import { PropertyAddComponent } from './pages/property-add/property-add.component';
import { PropertyEditComponent } from './pages/property-edit/property-edit.component';
import { UserListComponent } from './pages/user-list/user-list.component';
import { UserAddComponent } from './pages/user-add/user-add.component';
import { UserEditComponent } from './pages/user-edit/user-edit.component';
import { LogListComponent } from './pages/log-list/log-list.component';
import { LogDetailComponent } from './pages/log-detail/log-detail.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { ConfirmModalComponent } from './shared/confirm-modal/confirm-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PropertyListComponent,
    PropertyAddComponent,
    PropertyEditComponent,
    UserListComponent,
    UserAddComponent,
    UserEditComponent,
    LogListComponent,
    LogDetailComponent,
    NotFoundComponent,
    ConfirmModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
