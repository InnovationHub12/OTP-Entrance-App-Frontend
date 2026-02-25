import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Home } from './features/home/home';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Qrcodes } from './features/qrcodes/qrcodes';
import { ForgotPassword } from './forgot-password/forgot-password';
import { ScanQR } from './features/scan-qr/scan-qr';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { MatIconModule } from '@angular/material/icon';
import { LogIn } from './features/log-in/log-in';
import { Register } from './features/register/register';
import { AccessGranted } from './features/access-granted/access-granted';
import { AddAdmin } from './features/add-admin/add-admin';
import { Admin } from './features/admin/admin';
import { Navbar } from './shared/navbar/navbar';


@NgModule({
  declarations: [
    App,
    Home,
    Qrcodes,
    ForgotPassword,
    ScanQR,
    LogIn,
    Register,
    AccessGranted,
    AddAdmin,
    Admin,
    Navbar
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    MatSnackBarModule,
    ZXingScannerModule,
    MatIconModule
  ],
  providers: [],
  bootstrap: [App]
})
export class AppModule { }
