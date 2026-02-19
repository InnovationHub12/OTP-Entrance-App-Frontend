import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {VehicleLogEntry} from './vehicle-log-sevice';



@Injectable({
  providedIn: 'root',
})
export class VehicleLogService {
  private apiUrl = 'http://localhost:8080/api/vehicle-log';
  constructor(private http: HttpClient) {}

  getLogsForUser(idNumber: string): Observable<VehicleLogEntry[]> {
    return this.http.get<VehicleLogEntry[]>(`http://localhost:8080/api/vehicle-log/user/${idNumber}`);
  }
}
