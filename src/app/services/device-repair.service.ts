import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DeviceRepair, DeviceRepairRegistration } from '../../model/device-repair.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DeviceRepairService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/device-repair`;
  
  readonly deviceRepairs = signal<DeviceRepair[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  getDeviceRepairs(): Observable<DeviceRepair[]> {
    return this.http.get<DeviceRepair[]>(this.apiUrl);
  }

  getDeviceRepairById(id: number): Observable<DeviceRepair> {
    return this.http.get<DeviceRepair>(`${this.apiUrl}/${id}`);
  }

  registerDeviceRepair(repair: DeviceRepairRegistration): Observable<DeviceRepair> {
    return this.http.post<DeviceRepair>(this.apiUrl, repair);
  }

  updateDeviceRepair(id: number, repair: Partial<DeviceRepair>): Observable<DeviceRepair> {
    return this.http.put<DeviceRepair>(`${this.apiUrl}/${id}`, repair);
  }

  deleteDeviceRepair(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  searchDeviceRepairs(query: string): Observable<DeviceRepair[]> {
    return this.http.get<DeviceRepair[]>(`${this.apiUrl}/search?q=${query}`);
  }
}