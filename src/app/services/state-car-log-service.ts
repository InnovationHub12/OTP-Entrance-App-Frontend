import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface StateCarLog {
  id?: number;
  vehicleRegistration: string;
  userIdNumber: string;
  startKm?: number;
  endKm?: number;
  destination?: string;
  entranceTime?: string | null;
  exitTime?: string | null;
}
@Injectable({
  providedIn: 'root',
})
export class StateCarLogService {

  private apiUrl = `${environment.apiUrl}/state-cars`;

  constructor(private http: HttpClient) {}

  createLog(log: StateCarLog): Observable<StateCarLog> {
    return this.http.post<StateCarLog>(`${this.apiUrl}/log`, log);
  }

  getAllLogs(): Observable<StateCarLog[]> {
    return this.http.get<StateCarLog[]>(`${this.apiUrl}/logs`);
  }

  getLog(id: number): Observable<StateCarLog> {
    return this.http.get<StateCarLog>(`${this.apiUrl}/log/${id}`);
  }

  deleteLog(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getVehicleImages(userId: string, registration: string) {
    return this.http.get<string[]>(
      `${environment.apiUrl}/images/${userId}/${registration}`
    );
  }


}
