import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface VehicleLogEntry {
  id?: number;
  registrationNumber: string;
  entryDate?: string;
  entryTime?: string;
  exitTime?: string;
  user?: any; // will hold User object from backend
}

@Injectable({
  providedIn: 'root'
})
export class VehicleLogService {
  private apiUrl = 'http://localhost:8080/api/vehicle-log';

  constructor(private http: HttpClient) {}

  // Log a new vehicle entry linked to a user by idNumber
  logEntry(idNumber: number, entry: VehicleLogEntry): Observable<any> {
    return this.http.post(`${this.apiUrl}/entry/${idNumber}`, entry);
  }

  // Edit exit time or registration number for an existing entry
  editEntry(id: number, updateData: VehicleLogEntry): Observable<VehicleLogEntry> {
    return this.http.put<VehicleLogEntry>(`${this.apiUrl}/edit/${id}`, updateData);
  }

  // Get all logs for today
  getTodayLogs(): Observable<VehicleLogEntry[]> {
    return this.http.get<VehicleLogEntry[]>(`${this.apiUrl}/today`);
  }

  updateRegNumber(idNumber: string, regNumber: string) {
    return this.http.put<{ success: boolean; message: string; regNumber: string }>(
      'http://localhost:8080/api/users/updateRegNumber',
      { idNumber, regNumber }
    );
  }


}
