import { Component } from '@angular/core';
import { StateCarLogService, StateCarLog }from '../../services/state-car-log-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-state-vehicle-entry',
  standalone: false,
  templateUrl: './state-vehicle-entry.html',
  styleUrl: './state-vehicle-entry.css',
})
export class StateVehicleEntry {
 entries: StateCarLog[] = [];

   phase: 'exit' | 'return' | null = null;

   newEntry: StateCarLog = {
     vehicleRegistration: '',
     userIdNumber: '',
     startKm: 0,
     destination: ''
   };

   loading = false;

   constructor(private logService: StateCarLogService,
     private snackBar: MatSnackBar,
     private router: Router) {}

  checkPhase(): void {
     if (!this.newEntry.vehicleRegistration || !this.newEntry.userIdNumber) {
       this.snackBar.open('Enter Vehicle Registration and ID Number', 'Close', { duration: 3000 });
       return;
     }

     this.loading = true;

     this.logService.getAllLogs().subscribe({
       next: (logs) => {
         const matchingLogs = logs.filter(
           l =>
             l.vehicleRegistration === this.newEntry.vehicleRegistration &&
             l.userIdNumber === this.newEntry.userIdNumber
         );

         const existing = matchingLogs[matchingLogs.length - 1] ?? null;
         const startKmMissing = existing?.startKm == null || existing?.startKm === 0;
         const endKmMissing = existing?.endKm == null || existing?.endKm === 0;

         if (!existing || (startKmMissing && endKmMissing)) {
           this.phase = 'exit';
         } else if (!startKmMissing && endKmMissing) {
           this.phase = 'return';
           this.newEntry.startKm = existing!.startKm!;
         } else {
           this.phase = 'exit';
         }

         this.loading = false;
       },
       error: () => {
         this.snackBar.open('Failed to check logs', 'Close', { duration: 4000 });
         this.loading = false;
       }
     });
   }

   addEntry(): void {
     if (!this.phase) return;

     if (this.phase === 'exit') {
       if (!this.newEntry.startKm || !this.newEntry.destination) {
         this.snackBar.open('Start KM and Destination are required for exit.', 'Close', { duration: 4000 });
         return;
       }

       const payload: StateCarLog = {
         vehicleRegistration: this.newEntry.vehicleRegistration,
         userIdNumber: this.newEntry.userIdNumber,
         startKm: this.newEntry.startKm,
         destination: this.newEntry.destination
       };

       this.logService.createLog(payload).subscribe({
         next: (saved) => {
           this.entries.push(saved);
           this.resetForm();
           this.snackBar.open('Exit log saved successfully!', 'Close', { duration: 3000 });
           this.router.navigate(['/scan']); // Navigate to scan page
         },
         error: (err) => {
           this.snackBar.open(err.error?.message || 'Failed to save exit log', 'Close', { duration: 4000 });
         }
       });
     } else if (this.phase === 'return') {
       if (this.newEntry.endKm == null || this.newEntry.endKm < this.newEntry.startKm!) {
         this.snackBar.open('End KM must be greater than Start KM', 'Close', { duration: 4000 });
         return;
       }

       const payload: StateCarLog = {
         vehicleRegistration: this.newEntry.vehicleRegistration,
         userIdNumber: this.newEntry.userIdNumber,
         endKm: this.newEntry.endKm
       };

       this.logService.createLog(payload).subscribe({
         next: (saved) => {
           this.entries.push(saved);
           this.resetForm();
           this.snackBar.open('Return log saved successfully!', 'Close', { duration: 3000 });
           this.router.navigate(['/scan']); // Navigate to scan page
         },
         error: (err) => {
           this.snackBar.open(err.error?.message || 'Failed to save return log', 'Close', { duration: 4000 });
         }
       });
     }
   }

   resetForm(): void {
     this.newEntry = {
       vehicleRegistration: '',
       userIdNumber: '',
       startKm: 0,
       destination: '',
       endKm: undefined
     };
     this.phase = null;
   }
}
