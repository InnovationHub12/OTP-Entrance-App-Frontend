import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {}

  login(idNumber: number | string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { idNumber, password });
  }


  logout() {
    localStorage.removeItem("idNumber");
    localStorage.removeItem("regNumber");
    localStorage.removeItem("qrCode");
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

