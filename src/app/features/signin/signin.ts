import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService, LoginResponse } from '../../services/auth-service';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.html',
  imports: [
    FormsModule
  ],
  styleUrls: ['./signin.css']
})
export class Signin {
  idNumber: number | null = null;
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


          localStorage.setItem('userData', JSON.stringify(res));

          this.router.navigate(['/userProfile']);
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
