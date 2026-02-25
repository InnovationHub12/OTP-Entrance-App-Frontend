import { Component } from '@angular/core';
import {UserService} from '../../services/user-service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {User} from '../../Interfaces/user';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

  formData: User & { confirmPassword: string } = {
    idNumber: '',
    name: '',
    regNumber: '',
    password: '',
    role: '',
    confirmPassword: ''
  };

  message: string = '';

  constructor(private userService: UserService,
              private snackBar: MatSnackBar,
              private router: Router) {
  }

onSubmit(): void {
  // Check for empty/null values
  if (!this.formData.name || !this.formData.regNumber || !this.formData.idNumber ||
      !this.formData.password || !this.formData.confirmPassword || !this.formData.role) {
    this.snackBar.open('⚠️ Please fill in all required fields!', 'Close', {
      duration: 5000,
      panelClass: ['snackbar-error']
    });
    return;
  }

  // Check password match
  if (this.formData.password !== this.formData.confirmPassword) {
    this.snackBar.open('Passwords do not match!', 'Close', {
      duration: 5000,
      panelClass: ['snackbar-error']
    });
    return;
  }

  // Call backend
  this.userService.registerUser({
    idNumber: this.formData.idNumber,
    name: this.formData.name,
    regNumber: this.formData.regNumber,
    password: this.formData.password,
    role: this.formData.role
  }).subscribe({
    next: (res: { message: string }) => {
      this.snackBar.open(res.message || 'Registration successful!', 'Close', {
        duration: 5000,
        panelClass: ['snackbar-success']
      });
      this.router.navigate(['/signin']);
    },
    error: (err: { error: { message: any } }) => {
      this.snackBar.open(
        'Registration failed: ' + (err.error?.message || 'Unknown error'),
        'Close',
        {
          duration: 5000,
          panelClass: ['snackbar-error']
        }
      );
    }
  });
}
}
