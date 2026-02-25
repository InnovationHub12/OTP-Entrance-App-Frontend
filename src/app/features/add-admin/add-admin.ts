import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {UserService} from '../../services/user-service';
import {User} from '../../Interfaces/user';
@Component({
  selector: 'app-add-admin',
  standalone: false,
  templateUrl: './add-admin.html',
  styleUrl: './add-admin.css',
})
export class AddAdmin {

constructor(private userService: UserService,
            private snackBar: MatSnackBar) {}

onSubmit(form: any, adminForm?: any) {
  if (form.password !== form.confirmPassword) {
    this.snackBar.open('Passwords do not match!', 'Close', {
      duration: 3000,
      panelClass: ['error-snackbar']
    });
    return;
  }

  const newAdmin: User = {
    name: form.name,
    idNumber: form.idNumber,
    regNumber: form.regNumber,
    password: form.password,
    role: form.role,

  };

  this.userService.registerUser(newAdmin).subscribe({
    next: (res) => {
      console.log('Registered successfully', res);
      this.snackBar.open('✅ Admin registered successfully!', 'Close', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });

      // ✅ Clear the form fields
      if (adminForm) {
        adminForm.reset();
      }
    },
    error: (err) => {
      console.error('Registration failed', err);
      this.snackBar.open(
        '❌ Registration failed: ' + (err.error?.message || 'Unknown error'),
        'Close',
        { duration: 3000, panelClass: ['error-snackbar'] }
      );
    }
  });
}
}
