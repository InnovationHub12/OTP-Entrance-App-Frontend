import { Component } from '@angular/core';
import {AuthService} from '../../services/auth-service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { BarcodeFormat } from '@zxing/library'
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-scan-qr',
  standalone: false,
  templateUrl: './scan-qr.html',
  styleUrl: './scan-qr.css',
})
export class ScanQR {
  allowedFormats = [BarcodeFormat.QR_CODE];
  scannedRegNumber: string = '';
  logs: any[] = [];

  constructor(private authService: AuthService,
              private http: HttpClient,
              private snackBar: MatSnackBar) {}


  onScanSuccess(decodedText: string): void {
    // 1️⃣ Parse reg number from otpauth URI
    const match = decodedText.match(/OTP-Entrance%3A([^?]+)/);
    const regNumber = match ? decodeURIComponent(match[1]) : decodedText;

    this.scannedRegNumber = regNumber;

    // 2️⃣ Verify user
    this.authService.verifyQr(regNumber).subscribe({
      next: (res: VerifyQrResponse) => {
        if (res.success && res.user) {
          // 3️⃣ Grant access (UI feedback)
          this.snackBar.open('Access granted: User verified!', 'Close', {
            duration: 5000,
            panelClass: ['snackbar-success']
          });

          // 4️⃣ Log vehicle entry (make sure to call backend on port 8080 or via proxy)
          this.http.post(`http://localhost:8080/api/vehicle-log/entry/${res.user.idNumber}`, {
            registrationNumber: res.user.regNumber
          }).subscribe({
            next: () => {
              this.snackBar.open('Vehicle entry logged!', 'Close', {
                duration: 5000,
                panelClass: ['snackbar-success']
              });

              // 5️⃣ Refresh vehicle log table
              this.updateVehicleTable();
            },
            error: () => {
              this.snackBar.open('Failed to log vehicle entry', 'Close', {
                duration: 5000,
                panelClass: ['snackbar-error']
              });
            }
          });

        } else {
          this.snackBar.open(res.message || 'Verification failed', 'Close', {
            duration: 5000,
            panelClass: ['snackbar-error']
          });
        }
      },
      error: () => {
        this.snackBar.open('Error verifying QR code', 'Close', {
          duration: 5000,
          panelClass: ['snackbar-error']
        });
      }
    });
  }

  updateVehicleTable(): void {
    this.http.get<any[]>('/api/vehicle-log/today').subscribe({
      next: (data) => {
        this.logs = data; // update table data source
      },
      error: () => {
        this.snackBar.open('Failed to refresh vehicle log table', 'Close', {
          duration: 5000,
          panelClass: ['snackbar-error']
        });
      }
    });
  }
}

export interface VerifyQrResponse {
  success: boolean;
  message: string;
  user?: {
    idNumber: string;
    regNumber: string;
    name: string;
    role: string;
  };
}

