import { Component } from '@angular/core';
import {AuthService, LoginResponse} from '../../services/auth-service';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-log-in',
  standalone: false,
  templateUrl: './log-in.html',
  styleUrl: './log-in.css',
})
export class LogIn {

  idNumber: string | null = null;
  password: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  onSubmit(): void {
    if (!this.idNumber || !this.password) {
      this.snackBar.open('Please enter ID Number and Password', 'Close', {
        duration: 5000,
        panelClass: ['snackbar-error']
      });
      return;
    }

    this.authService.login(this.idNumber, this.password).subscribe({
      next: (res: LoginResponse) => {
        if (res.success) {
          this.snackBar.open('Login successful!', 'Close', {
            duration: 8000,
            panelClass: ['snackbar-success']
          });

          // Save user data
          localStorage.setItem('userData', JSON.stringify(res));


          if (res.role === 'security') {
            this.router.navigate(['/scan']);
          } else {
            this.router.navigate(['/userProfile']);
          }

        } else {
          this.snackBar.open(res.message || 'Login failed', 'Close', {
            duration: 8000,
            panelClass: ['snackbar-error']
          });
        }
      },
      error: (err: { error: { message: string } }) => {
        this.snackBar.open(err.error?.message || 'Unknown error', 'Close', {
          duration: 8000,
          panelClass: ['snackbar-error']
        });
      }
    });
  }

}
