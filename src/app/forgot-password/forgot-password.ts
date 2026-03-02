import { Component } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../services/auth-service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: false,
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {
  email: string = '';
  otp: string = '';
  newPassword: string = '';
  otpSent: boolean = false;


  constructor(private http: HttpClient,
    private authService : AuthService,
     private router: Router,
) {}

 requestOtp(): void {
   this.http.post('http://localhost:8080/api/users/forgot-password', {
     email: this.email
   }).subscribe({
     next: (res: any) => {
       this.otpSent = true;
       alert(res.message);
     },
     error: (err) => {
       alert(err.error?.message || 'Error sending OTP');
     }
   });
 }

resetPassword(): void {
  this.http.post('http://localhost:8080/api/users/reset-password-with-otp', {
    email: this.email,
    otp: this.otp,
    newPassword: this.newPassword
  }).subscribe({
    next: (res: any) => {
      alert(res.message);
      this.email = '';
      this.otp = '';
      this.newPassword = '';
      this.goToLogin();
    },
    error: (err) => {
      alert(err.error?.message || 'Error resetting password');
    }
  });
}

 goToLogin() {
    this.router.navigate(['/login']);
  }
}

