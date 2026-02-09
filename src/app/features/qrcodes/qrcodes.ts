import {Component, OnInit} from '@angular/core';
import {VehicleLogService} from '../../services/vehicle-log-sevice';
import {AuthService} from '../../services/auth-service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-qrcodes',
  standalone: false,
  templateUrl: './qrcodes.html',
  styleUrl: './qrcodes.css',
})
export class Qrcodes implements OnInit {
  otp: string = '';
  qrCodeUrl: string | null = null;
  userData: any;
  showModal = false;
  editableRegNumber: string = '';

  constructor(private vehicleLogService: VehicleLogService,
              private authService: AuthService,
              private router : Router) {}

  ngOnInit(): void {
    const data = localStorage.getItem('userData');
    if (data) {
      this.userData = JSON.parse(data);

      if (this.userData.qrCode) {
        // ✅ Add prefix here
        this.qrCodeUrl = 'data:image/png;base64,' + this.userData.qrCode;
      } else {
        console.error('No QR code found in userData');
      }
    }
  }

  onDoubleClick(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  saveRegNumber(): void {
    this.vehicleLogService.updateRegNumber(this.userData.idNumber, this.editableRegNumber).subscribe({
      next: (res) => {
        if (res.success) {
          this.userData.regNumber = res.regNumber;
          localStorage.setItem('userData', JSON.stringify(this.userData));
          this.closeModal();
        } else {
          console.error(res.message);
        }
      },
      error: (err) => {
        console.error('Failed to update regNumber', err);
      }
    });
  }

  signOut() {
    this.authService.logout();
     this.router.navigate(['/signing']);
  }
}
