import {Component, OnInit} from '@angular/core';
import { UserService} from '../../services/user-service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { VehicleLogService } from '../../services/vehicle-log-service';
import {VehicleEntry} from '../../Interfaces/vehicle-entry';

@Component({
  selector: 'app-admin',
  standalone: false,
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin implements OnInit {
  users: any[] = [];
  userLogs: { [idNumber: string]: VehicleEntry[] } = {};
  expandedUserId: string | null = null;

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
    private logService: VehicleLogService
  ) {
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data ?? [];

        // ✅ Initialize logs for each user
        this.users.forEach(user => {
          if (!this.userLogs[user.idNumber]) {
            this.userLogs[user.idNumber] = [];
          }
        });
      },
      error: (err) => {
        console.error('Failed to load users', err);
        this.snackBar.open('Failed to load users', 'Close', {
          duration: 5000,
          panelClass: ['snackbar-error']
        });
      }
    });
  }

  toggleDropdown(userId: string): void {
    if (this.expandedUserId === userId) {
      this.expandedUserId = null;
    } else {
      this.expandedUserId = userId;
      if (!this.userLogs[userId] || this.userLogs[userId].length === 0) {
        this.logService.getLogsForUser(userId).subscribe({
          next: (logs) => (this.userLogs[userId] = logs ?? []),
          error: (err) => console.error('Failed to load logs', err) });
      }
    }
  }

  deleteUser(idNumber: string): void {
    this.userService.deleteUser(idNumber).subscribe({
      next: () => {
        this.users = this.users.filter(u => u.idNumber !== idNumber);
        delete this.userLogs[idNumber];
        this.snackBar.open('User deleted successfully', 'Close', {
          duration: 5000,
          panelClass: ['snackbar-success']
        });
      },
      error: () => {
        this.snackBar.open('Failed to delete user', 'Close', {
          duration: 5000,
          panelClass: ['snackbar-error']
        });
      }
    });
  }
}
