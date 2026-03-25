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
import { StateVehicleLog } from './features/state-vehicle-log/state-vehicle-log';
import { StateVehicleEntry } from './features/state-vehicle-entry/state-vehicle-entry';
import { authGuard } from './auth-guard';


const routes: Routes = [
  { path: 'register', component: Register },
  { path: 'scan', component: ScanQR , canActivate: [authGuard] },
  { path: 'home', component: Home , canActivate: [authGuard] },
  { path: 'state-entry', component: StateVehicleEntry , canActivate: [authGuard]},
  { path: 'state-vehicle', component: StateVehicleLog , canActivate: [authGuard]},
  {path: 'admin',component: Admin , canActivate: [authGuard]},
  {path: 'add-admin',component: AddAdmin , canActivate: [authGuard]},
  { path: 'access-granted', component: AccessGranted , canActivate: [authGuard]},
  {path: 'userProfile',component:Qrcodes , canActivate: [authGuard]},
  {path: 'forgot-password',component:ForgotPassword},
   { path: '', redirectTo: '/login', pathMatch: 'full' },
   { path: 'login', component: LogIn }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
