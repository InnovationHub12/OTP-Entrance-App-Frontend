import { Component } from '@angular/core';
import { StateCarLogService, StateCarLog }from '../../services/state-car-log-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { VehicleImageService } from '../../services/vehicle-image-service';

@Component({
  selector: 'app-state-vehicle-entry',
  standalone: false,
  templateUrl: './state-vehicle-entry.html',
  styleUrl: './state-vehicle-entry.css',
})
export class StateVehicleEntry {
 entries: StateCarLog[] = [];
   imagesCaptured = false;
   phase: 'exit' | 'return' | null = null;

   newEntry: StateCarLog = {
     vehicleRegistration: '',
     userIdNumber: '',
     startKm: 0,
     destination: ''
   };

   loading = false;

   video!: HTMLVideoElement;
   canvas!: HTMLCanvasElement;
   stream!: MediaStream;
   images: string[] = [];
   step = 0;
   steps = ['Front', 'Back', 'Left', 'Right'];

   constructor(
     private logService: StateCarLogService,
     private snackBar: MatSnackBar,
     private imageService: VehicleImageService
   ) {}

   ngOnInit(): void {

     this.video = document.querySelector('video')!;
     this.canvas = document.querySelector('canvas')!;
   }

   ngOnDestroy(): void {
     this.stopCamera();
   }

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

           if (this.imagesCaptured) {
             this.imageService.uploadImages(
               this.newEntry.vehicleRegistration,
               this.newEntry.userIdNumber,
               this.phase!,
               this.images
             ).then(() => {
               this.snackBar.open('✅ Log and images saved successfully!', 'Close', { duration: 3000 });
             }).catch((err: any) => {
               this.snackBar.open(`❌ Log saved but image upload failed: ${err.message}`, 'Close', { duration: 4000 });
             });
           } else {
             this.snackBar.open('✅ Log saved successfully!', 'Close', { duration: 3000 });
           }

           this.resetForm();
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

           if (this.imagesCaptured) {
             this.imageService.uploadImages(
               this.newEntry.vehicleRegistration,
               this.newEntry.userIdNumber,
               this.phase!,
               this.images
             ).then(() => {
               this.snackBar.open('✅ Log and images saved successfully!', 'Close', { duration: 3000 });
             }).catch((err: any) => {
               this.snackBar.open(`❌ Log saved but image upload failed: ${err.message}`, 'Close', { duration: 4000 });
             });
           } else {
             this.snackBar.open('✅ Log saved successfully!', 'Close', { duration: 3000 });
           }

           this.resetForm();
         },
         error: (err) => {
           this.snackBar.open(err.error?.message || 'Failed to save return log', 'Close', { duration: 4000 });
         }
       });
     }
   }

   async openCamera(): Promise<void> {
     if (!this.phase) {
       this.snackBar.open('Please check phase first', 'Close', { duration: 3000 });
       return;
     }

     try {
       this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
       this.video.srcObject = this.stream;
       this.video.play();
     } catch (err) {
       this.snackBar.open('Camera access denied or not available', 'Close', { duration: 3000 });
     }
   }

   stopCamera(): void {
     if (this.stream) {
       this.stream.getTracks().forEach(track => track.stop());
     }
   }

  capture(): void {
    const context = this.canvas.getContext('2d');
    if (!context) return;

    this.canvas.width = this.video.videoWidth;
    this.canvas.height = this.video.videoHeight;

    context.drawImage(this.video, 0, 0);
    const imageData = this.canvas.toDataURL('image/png');
    this.images.push(imageData);

    this.step++;

    if (this.step === 4) {
      this.stopCamera();
      this.snackBar.open('✅ All 4 images captured. Now click Save Entry.', 'Close', { duration: 3000 });
      this.imagesCaptured = true;
    }
  }


  retake(): void {
    if (this.step > 0) {
      this.step--;
      this.images.pop();

      if (!this.stream || this.stream.getTracks().every(track => track.readyState === 'ended')) {
        this.openCamera();
      }

      this.snackBar.open(`📸 Retake ${this.steps[this.step]} image`, 'Close', { duration: 2000 });
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
     this.images = [];
     this.step = 0;
     this.imagesCaptured = false;
   }
}
