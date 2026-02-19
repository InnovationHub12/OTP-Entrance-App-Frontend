import {VehicleEntry} from './vehicle-entry';

export interface User {
  idNumber: string;
  name: string;
  regNumber: string;
  password: string;
  role: string;
  vehicleEntries?: VehicleEntry[];
}
