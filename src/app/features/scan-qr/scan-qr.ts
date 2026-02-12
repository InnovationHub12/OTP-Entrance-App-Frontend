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
  constructor(private authService: AuthService,
              private http: HttpClient,
              private snackBar: MatSnackBar) {}

  onScanSuccess(decodedText: string): void {
    // decodedText is the full otpauth URI from the QR scanner
    const match = decodedText.match(/OTP-Entrance%3A([^?]+)/);
    const regNumber = match ? decodeURIComponent(match[1]) : decodedText;

    this.scannedRegNumber = regNumber;

    this.authService.verifyQr(regNumber).subscribe({
      next: (res: VerifyQrResponse) => {
        if (res.success && res.user) {
          // ✅ Show verification success
          this.snackBar.open('User verified successfully!', 'Close', {
            duration: 5000,
            panelClass: ['snackbar-success']
          });

          // ✅ Log vehicle entry
          this.http.post(`/api/vehicle-log/entry/${res.user.idNumber}`, {
            registrationNumber: res.user.regNumber
          }).subscribe({
            next: () => {
              this.snackBar.open('Vehicle entry logged!', 'Close', {
                duration: 5000,
                panelClass: ['snackbar-success']
              });
            },
            error: () => {
              this.snackBar.open('Failed to log vehicle entry', 'Close', {
                duration: 5000,
                panelClass: ['snackbar-error']
              });
            }
          });

        } else {
          // ❌ Verification failed
          this.snackBar.open(res.message || 'Verification failed', 'Close', {
            duration: 5000,
            panelClass: ['snackbar-error']
          });
        }
      },
      error: () => {
        // ❌ API error
        this.snackBar.open('Error verifying QR code', 'Close', {
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

