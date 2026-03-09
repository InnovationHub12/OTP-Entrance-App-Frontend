import { Component } from '@angular/core';
import {AuthService} from '../../services/auth-service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { BarcodeFormat } from '@zxing/library'
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-scan-qr',
  standalone: false,
  templateUrl: './scan-qr.html',
  styleUrl: './scan-qr.css',
})
export class ScanQR {
viewMode: 'scanner' | 'login' | 'exit' = 'scanner';
  allowedFormats = [BarcodeFormat.QR_CODE];
  scannedRegNumber: string = '';
  logs: any[] = [];
  exitIdNumber: string = '';
  idNumber: string = '';
  private vehicleLogUrl = `${environment.apiUrl}/vehicle-log`;

  constructor(private authService: AuthService,
              private http: HttpClient,
              private snackBar: MatSnackBar,
              private router: Router) {}


  onScanSuccess(decodedText: string): void {
    const match = decodedText.match(/OTP-Entrance%3A([^?]+)/);
    const regNumber = match ? decodeURIComponent(match[1]) : decodedText;
    this.scannedRegNumber = regNumber;

    this.authService.verifyQr(regNumber).subscribe({
      next: (res: VerifyQrResponse) => {
        if (res.success && res.user) {
          this.snackBar.open('Access granted: User verified!', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-success'],
          });

          // 🔹 Navigate to success page with user name
          this.router.navigate(['/access-granted'], { queryParams: { name: res.user.name } });

          // Log vehicle entry
          this.http.post(`${this.vehicleLogUrl}/entry/${res.user.idNumber}`, {
            registrationNumber: res.user.regNumber
          }).subscribe({
            next: () => this.updateVehicleTable(),
            error: () => this.snackBar.open('Failed to log vehicle entry', 'Close', {
              duration: 5000,
              panelClass: ['snackbar-error'],
            })
          });

        } else {
          this.snackBar.open(res.message || 'Verification failed', 'Close', {
            duration: 5000,
            panelClass: ['snackbar-error'],
          });
        }
      },
      error: () => {
        this.snackBar.open('Error verifying QR code', 'Close', {
          duration: 5000,
          panelClass: ['snackbar-error'],
        });
      }
    });
  }


  updateVehicleTable(): void {
    this.http.get<any[]>(`${this.vehicleLogUrl}/today`).subscribe({
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

  onLogin(): void {
    this.authService.loginWithId(this.idNumber).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.snackBar.open('Login successful!', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-success'],
          });

          // 🔹 Navigate to success page with user name
          this.router.navigate(['/access-granted'], { queryParams: { name: res.name } });


          this.http.post(`${this.vehicleLogUrl}/entry/${res.idNumber}`, {
            registrationNumber: res.regNumber
          }).subscribe({
            next: () => this.updateVehicleTable(),
            error: () => this.snackBar.open('Failed to log vehicle entry', 'Close', {
              duration: 5000,
              panelClass: ['snackbar-error'],
            })
          });

        } else {
          this.snackBar.open(res.message || 'Login failed', 'Close', {
            duration: 5000,
            panelClass: ['snackbar-error'],
          });
        }
      },
      error: () => {
        this.snackBar.open('Error logging in with ID number', 'Close', {
          duration: 5000,
          panelClass: ['snackbar-error'],
        });
      },
    });
  }
  showScanner(): void {
    this.viewMode = 'scanner';
  }

  showLogin(): void {
    this.viewMode = 'login';
  }

onExit(): void {
  this.http.put(`${this.vehicleLogUrl}/edit/${this.exitIdNumber}`, {
    registrationNumber: this.scannedRegNumber || null
  }).subscribe({
    next: (res: any) => {
      this.snackBar.open('Exit logged successfully!', 'Close', {
        duration: 3000,
        panelClass: ['snackbar-success'],
      });
      this.updateVehicleTable();
    },
    error: () => {
      this.snackBar.open('Failed to log exit', 'Close', {
        duration: 5000,
        panelClass: ['snackbar-error'],
      });
    }
  });
}

showExit(): void {
  this.viewMode = 'exit';
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

