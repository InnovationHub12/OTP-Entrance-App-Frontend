import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {Home} from './features/home/home';
import {Qrcodes} from './features/qrcodes/qrcodes';
import {ForgotPassword} from './forgot-password/forgot-password';
import {ScanQR} from './features/scan-qr/scan-qr';
import {LogIn} from './features/log-in/log-in';
import {Register} from './features/register/register';
import {AccessGranted} from './features/access-granted/access-granted';
import {Admin} from './features/admin/admin';
import {AddAdmin} from './features/add-admin/add-admin';

const routes: Routes = [
  { path: 'register', component: Register },
  { path: 'login', component: LogIn },
  { path: 'scan', component: ScanQR },
  { path: 'home', component: Home },
  {path: 'admin',component: Admin},
  {path: 'add-admin',component: AddAdmin},
  { path: 'access-granted', component: AccessGranted },
  {path: 'userProfile',component:Qrcodes},
  {path: 'forgot-password',component:ForgotPassword}
,  { path: '', redirectTo: '/home', pathMatch: 'full' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
