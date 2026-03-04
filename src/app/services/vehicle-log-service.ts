import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {VehicleLogEntry} from './vehicle-log-sevice';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class VehicleLogService {
private apiUrl = `${environment.apiUrl}/vehicle-log`;
  constructor(private http: HttpClient) {}

  getLogsForUser(idNumber: string): Observable<VehicleLogEntry[]> {
  return this.http.get<VehicleLogEntry[]>(`${this.apiUrl}/user/${idNumber}`);
  }
}
