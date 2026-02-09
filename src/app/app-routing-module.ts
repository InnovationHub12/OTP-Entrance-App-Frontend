import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {Signup} from './features/signup/signup';
import {Signin} from './features/signin/signin';
import {Home} from './features/home/home';
import {Qrcodes} from './features/qrcodes/qrcodes';


const routes: Routes = [
  { path: 'signup', component: Signup },
  { path: 'signing', component: Signin },
  { path: 'home', component: Home },
  {path: 'userProfile',component:Qrcodes}
,  { path: '', redirectTo: '/home', pathMatch: 'full' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
