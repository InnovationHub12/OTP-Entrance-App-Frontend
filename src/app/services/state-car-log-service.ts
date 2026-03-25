import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
private apiUrl = 'http://localhost:8080/api/state-cars';

  constructor(private http: HttpClient) {}

  /** Create a new log */
  createLog(log: StateCarLog): Observable<StateCarLog> {
    return this.http.post<StateCarLog>(`${this.apiUrl}/log`, log);
  }

  /** Get all logs */
  getAllLogs(): Observable<StateCarLog[]> {
    return this.http.get<StateCarLog[]>(`${this.apiUrl}/logs`);
  }

  /** Get a single log by ID */
  getLog(id: number): Observable<StateCarLog> {
    return this.http.get<StateCarLog>(`${this.apiUrl}/log/${id}`);
  }
/** Delete a log by ID */
deleteLog(id: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/${id}`);
}
getVehicleImages(userId: string, registration: string) {
  return this.http.get<string[]>(`http://localhost:8080/api/images/${userId}/${registration}`);
}


}
