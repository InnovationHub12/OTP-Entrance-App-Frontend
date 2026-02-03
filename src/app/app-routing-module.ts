import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {Signup} from './features/signup/signup';
import {Signin} from './features/signin/signin';
import {Home} from './features/home/home';


const routes: Routes = [
  { path: 'signup', component: Signup },
  { path: 'signin', component: Signin },
  { path: 'home', component: Home },
  { path: '', redirectTo: '/signin', pathMatch: 'full' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
