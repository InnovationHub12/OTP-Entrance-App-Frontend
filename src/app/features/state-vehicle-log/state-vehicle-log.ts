import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { environment } from '../../../environments/environment';
import { PageEvent } from '@angular/material/paginator';
import { StateVehicleDialog } from '../state-vehicle-dialog/state-vehicle-dialog';
import { StateCarLogService }from '../../services/state-car-log-service';

@Component({
  selector: 'app-state-vehicle-log',
  standalone: false,
  templateUrl: './state-vehicle-log.html',
  styleUrl: './state-vehicle-log.css',
})
export class StateVehicleLog implements OnInit {
   steps = ['Front', 'Back', 'Left', 'Right'];
    currentIndex = 0;
  vehicles: any[] = [];
    paginatedVehicles: any[] = [];
    pageSize = 5;
    currentPage = 0;
    searchTerm: string = '';

    selectedVehicle: any;
    menuTopLeftPosition = { x: '0px', y: '0px' };

    private stateCarUrl = `${environment.apiUrl}/state-cars`;

    @ViewChild(MatMenuTrigger, { static: true }) contextMenu!: MatMenuTrigger;

    constructor(
      private http: HttpClient,
      private snackBar: MatSnackBar,
      private dialog: MatDialog,
      private stateCarLogService: StateCarLogService
    ) {}

    ngOnInit(): void {
      this.loadVehicles();
    }

    loadVehicles(): void {
      this.http.get<any[]>(`${this.stateCarUrl}/logs`).subscribe({
        next: (data) => {
          this.vehicles = data ?? [];
          this.updatePaginatedVehicles();
        },
        error: () => {
          this.snackBar.open('Failed to load state vehicles', 'Close', { duration: 5000 });
        },
      });
    }

    openContextMenu(event: MouseEvent, vehicle: any): void {
      event.preventDefault();
      this.selectedVehicle = vehicle;
      this.menuTopLeftPosition.x = event.clientX + 'px';
      this.menuTopLeftPosition.y = event.clientY + 'px';
      if (this.contextMenu) {
        this.contextMenu.openMenu();
      }
    }

 viewDetails(vehicle: any): void {
   this.stateCarLogService.getVehicleImages(vehicle.userIdNumber, vehicle.vehicleRegistration)
     .subscribe({
       next: (images: string[]) => {
         this.dialog.open(StateVehicleDialog, {
           width: '800px',
           maxWidth: '95vw',
           panelClass: 'custom-dialog',
           data: { ...vehicle, images }
         });
       },
       error: () => {
         this.snackBar.open('Failed to load vehicle images', 'Close', { duration: 4000 });
         this.dialog.open(StateVehicleDialog, {
           width: '800px',
           maxWidth: '95vw',
           panelClass: 'custom-dialog',
           data: { ...vehicle, images: [] }
         });
       }
     });
 }


    deleteVehicle(vehicle: any): void {
      this.stateCarLogService.deleteLog(vehicle.id).subscribe({
        next: () => {
          this.snackBar.open(
            `Vehicle ${vehicle.vehicleRegistration} deleted successfully`,
            'Close',
            { duration: 3000 }
          );
          this.loadVehicles(); // refresh list
        },
        error: (err: any) => {
          const message = err.error?.message || 'Failed to delete vehicle';
          this.snackBar.open(message, 'Close', { duration: 5000 });
        }
      });
    }

   filterVehicles(): void {
     const term = this.searchTerm.trim().toLowerCase();

     const sourceList = term
       ? this.vehicles.filter(v =>
           v.vehicleRegistration.toLowerCase().includes(term) ||
           v.driverName.toLowerCase().includes(term) ||
           (v.startKm && v.startKm.toString().includes(term)) ||
           (v.endKm && v.endKm.toString().includes(term)) ||
           (v.totalDistance && v.totalDistance.toString().includes(term))
         )
       : this.vehicles;

     const startIndex = this.currentPage * this.pageSize;
     this.paginatedVehicles = sourceList.slice(startIndex, startIndex + this.pageSize);
   }


    updatePaginatedVehicles(): void {
      const startIndex = this.currentPage * this.pageSize;
      this.paginatedVehicles = this.vehicles.slice(startIndex, startIndex + this.pageSize);
    }

    onPageChange(event: PageEvent): void {
      this.pageSize = event.pageSize;
      this.currentPage = event.pageIndex;
      this.filterVehicles();
    }
 }
