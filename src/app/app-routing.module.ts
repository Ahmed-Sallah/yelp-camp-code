import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "./auth/auth.guard";
import { LoginComponent } from "./auth/login/login.component";
import { SignupComponent } from "./auth/signup/signup.component";
import { CampListComponent } from "./Campgrounds/camp-list/camp-list.component";
import { EditCampgroundComponent } from "./Campgrounds/edit-campground/edit-campground.component";
import { NewCampgroundComponent } from "./Campgrounds/new-campground/new-campground.component";
import { ShowCampgroundComponent } from "./Campgrounds/show-campground/show-camp.component";
import { HomeComponent } from "./Home/home.component";
import { PageNotFound } from "./page-not-found/page-not-found.component";

const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'campgrounds', component: CampListComponent},
  {path: 'campgrounds/new', component: NewCampgroundComponent, canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'campgrounds/:id', component: ShowCampgroundComponent},
  {path: 'campgrounds/:id/edit', component: EditCampgroundComponent, canActivate: [AuthGuard]},
  {path: 'not-found', component: PageNotFound},
  {path: '**', redirectTo: '/not-found'}

]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})

export class AppRouting {

}
