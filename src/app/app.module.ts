import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CampListComponent } from './Campgrounds/camp-list/camp-list.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRouting } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditCampgroundComponent } from './Campgrounds/edit-campground/edit-campground.component';
import { NewCampgroundComponent } from './Campgrounds/new-campground/new-campground.component';
import { ShowCampgroundComponent } from './Campgrounds/show-campground/show-camp.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './header/header.component';
import { AngularMaterialModule } from './angular-material.module';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthInterceptor } from './auth/auth-interceptor';
import { ErrorInterceptor } from './error.interceptor';
import { ErrorComponent } from './error/error.component';
import { HomeComponent } from './Home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    CampListComponent,
    EditCampgroundComponent,
    NewCampgroundComponent,
    ShowCampgroundComponent,
    HeaderComponent,
    LoginComponent,
    SignupComponent,
    ErrorComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRouting,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    FormsModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}
  ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent]
})
export class AppModule { }
