import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-state-vehicle-dialog',
  standalone: false,
  templateUrl: './state-vehicle-dialog.html',
  styleUrl: './state-vehicle-dialog.css',
})
export class StateVehicleDialog {
    steps = ['Front', 'Back', 'Left', 'Right'];
    currentIndex = 0;
 constructor(
    public dialogRef: MatDialogRef<StateVehicleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

 close(): void {
    this.dialogRef.close();
  }
get currentImage(): string {
  return this.data.images && this.data.images.length > 0
    ? this.data.images[this.currentIndex].url
    : '';
}
get currentPhase(): string {
  return this.data.images?.[this.currentIndex]?.phase || '';
}

get currentSide(): string {
  return this.data.images?.[this.currentIndex]?.side || '';
}

 get currentStep(): string {
    return this.steps[this.currentIndex] || `Image ${this.currentIndex + 1}`;
  }

nextImage(): void {
    if (this.data.images && this.currentIndex < this.data.images.length - 1) {
      this.currentIndex++;
    }
  }

prevImage(): void {
    if (this.data.images && this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

}
