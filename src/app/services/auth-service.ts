import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/users';
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
      'http://localhost:8080/api/otp/scan-verify',
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

}
export interface LoginResponse {
  success: boolean;
  message: string;
  role: string;
  name: string;
  surname: string;
  regNumber: string;
  qrCode: string;
}

