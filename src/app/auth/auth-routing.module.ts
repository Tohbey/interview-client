import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import {SignUpComponent} from "./sign-up/sign-up.component";

const routes: Routes = [
  {path:'', pathMatch:'full', redirectTo:'login'},
  {path:'login', component: LoginComponent},
  {path:'sign-up', component: SignUpComponent},
  {path: 'reset-password/:token/:email', component: ResetPasswordComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
