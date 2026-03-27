import {Component, OnInit} from '@angular/core';
import { UserService} from '../../services/user-service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { VehicleLogService } from '../../services/vehicle-log-service';
import {VehicleEntry} from '../../Interfaces/vehicle-entry';
import { PageEvent } from '@angular/material/paginator';

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
  paginatedUsers: any[] = [];
  pageSize = 5;
  currentPage = 0;
  searchTerm: string = '';

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
    private logService: VehicleLogService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.updatePaginatedUsers();
  }

 loadUsers(): void {
   this.userService.getAllUsers().subscribe({
     next: (data) => {
       this.users = data ?? [];

       this.users.forEach(user => {
         this.logService.getLogsForUser(user.idNumber).subscribe({
           next: (logs) => {
             this.userLogs[user.idNumber] = logs ?? [];
           },
           error: (err) => console.error(`Failed to load logs for ${user.idNumber}`, err)
         });
       });

       this.updatePaginatedUsers();
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


updatePaginatedUsers(): void {
  const startIndex = this.currentPage * this.pageSize;
  const endIndex = startIndex + this.pageSize;
  this.paginatedUsers = this.users.slice(startIndex, endIndex);
}


filterUsers(): void {
  const term = this.searchTerm.trim().toLowerCase();

  const sourceList = term
    ? this.users.filter(user =>
        user.idNumber.toLowerCase().includes(term) ||
        user.regNumber.toLowerCase().includes(term) ||
        user.name.toLowerCase().includes(term) ||
        user.role.toLowerCase().includes(term)
      )
    : this.users;

  const startIndex = this.currentPage * this.pageSize;
  const endIndex = startIndex + this.pageSize;
  this.paginatedUsers = sourceList.slice(startIndex, endIndex);
}

onPageChange(event: PageEvent): void {
  this.pageSize = event.pageSize;
  this.currentPage = event.pageIndex;
  this.filterUsers();
}

viewUser(idNumber: string): void {
  this.expandedUserId = this.expandedUserId === idNumber ? null : idNumber;
}
}
