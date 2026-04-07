import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
private apiUrl = `${environment.apiUrl}/users`;
private otpUrl = `${environment.apiUrl}/otp`;

  private role: string | null = null;

  constructor(private http: HttpClient) {}

  login(idNumber: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { idNumber, password });
  }


  logout() {
    localStorage.removeItem("idNumber");
    localStorage.removeItem("regNumber");
    localStorage.removeItem("qrCode");
  }


  loginWithId(idNumber: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login-with-id`, { idNumber });
  }

  verifyQr(regNumber: string) {
    return this.http.post<{ success: boolean; message: string }>(
        `${this.otpUrl}/scan-verify`,
        { regNumber }
    );
  }

  setRole(role: string): void {
    this.role = role;
    localStorage.setItem('role', role);
  }

  getRole(): string | null {
    return this.role ?? localStorage.getItem('role');
  }
isLoggedIn(): boolean {
  const data = localStorage.getItem('userData');
  if (data) {
    const parsed = JSON.parse(data);
    return parsed.success === true;
  }
  return false;
}


}
export interface LoginResponse {
  success: boolean;
  message: string;
  role: string;
  name: string;
  surname: string;
  regNumber: string;
  qrCode: string;
  idNumber: string;
}

