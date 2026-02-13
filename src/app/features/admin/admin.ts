import {Component, OnInit} from '@angular/core';
import {User, UserService} from '../../services/user-service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin',
  standalone: false,
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin implements OnInit{

  users: User[] = [];
  constructor(private userService: UserService, private snackBar :MatSnackBar) {}
  ngOnInit(): void {
    this.loadUsers();
     }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        },
      error: (err) => console.error('Failed to load users', err)
    });
  }

  deleteUser(idNumber: string): void {
    this.userService.deleteUser(idNumber).subscribe({
      next: () => {

        this.users = this.users.filter(user => user.idNumber !== idNumber);


        this.snackBar.open('User deleted successfully', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
      },
      error: (err: any) => {
        console.error('Failed to delete user', err);

        this.snackBar.open('Failed to delete user', 'Close', {
          duration: 5000,
          panelClass: ['snackbar-error']
        });
      }
    });
  }

}
