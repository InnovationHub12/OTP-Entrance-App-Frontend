import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {VerifyQrResponse} from '../features/scan-qr/scan-qr';

@Injectable({
  providedIn: 'root'
})
export class OtpService {

  private baseUrl = 'http://localhost:8080/api/otp';

  constructor(private http: HttpClient) {}

  getQrCode(regNumber: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/qr?regNumber=${encodeURIComponent(regNumber)}`);
  }

  verifyQr(regNumber: string): Observable<VerifyQrResponse> {
    return this.http.post<VerifyQrResponse>('/api/otp/scan-verify', { regNumber });
  }

}
