import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-state-vehicle-dialog',
  standalone: false,
  templateUrl: './state-vehicle-dialog.html',
  styleUrl: './state-vehicle-dialog.css',
})
export class StateVehicleDialog {
 constructor(
    public dialogRef: MatDialogRef<StateVehicleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

 close(): void {
    this.dialogRef.close();
  }
}
