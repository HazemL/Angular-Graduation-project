// src/services/device-repair.service.ts
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, forkJoin, map } from 'rxjs';
import { DeviceRepair, DeviceRepairRegistration } from '../../model/device-repair.model';
import { ApiResponse, CraftsmanApi, ProfessionApi } from '../../model/api-response.model';
import { MapperService } from './mapper.service';

@Injectable({
  providedIn: 'root'
})
export class DeviceRepairService {
  private readonly http = inject(HttpClient);
  private readonly mapper = inject(MapperService);
  private readonly apiUrl = `${environment.apiUrl}/api`;

  readonly deviceRepairs = signal<DeviceRepair[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  /**
   * Get all device repair technicians (filters craftsmen by device repair profession)
   */
  getDeviceRepairs(): Observable<DeviceRepair[]> {
    return forkJoin({
      craftsmen: this.http.get<ApiResponse<CraftsmanApi[]>>(`${this.apiUrl}/craftsmen`),
      professions: this.http.get<ProfessionApi[]>(`${this.apiUrl}/professions`)
    }).pipe(
      map(({ craftsmen, professions }) => {
        if (!craftsmen.success) {
          throw new Error(craftsmen.message || 'Failed to fetch craftsmen');
        }
        return this.mapper.filterDeviceRepairs(craftsmen.data, professions);
      })
    );
  }

  /**
   * Get device repair technician by ID
   */
  getDeviceRepairById(id: number): Observable<DeviceRepair> {
    return forkJoin({
      craftsman: this.http.get<ApiResponse<CraftsmanApi>>(`${this.apiUrl}/craftsmen/${id}`),
      professions: this.http.get<ProfessionApi[]>(`${this.apiUrl}/professions`)
    }).pipe(
      map(({ craftsman, professions }) => {
        if (!craftsman.success) {
          throw new Error(craftsman.message || 'Failed to fetch device repair technician');
        }
        return this.mapper.mapToDeviceRepair(craftsman.data, professions);
      })
    );
  }

  /**
   * Register new device repair technician
   */
  registerDeviceRepair(repair: DeviceRepairRegistration): Observable<DeviceRepair> {
    return this.http.post<ApiResponse<CraftsmanApi>>(`${this.apiUrl}/craftsmen`, {
      fullName: repair.name,
      email: repair.email,
      phone: repair.phone,
      address: repair.address,
      professionId: 8, // Device Repair profession ID
      experienceYears: repair.experience,
      bio: `${repair.specialization} - ${repair.warranty ? 'يوجد ضمان' : 'بدون ضمان'} - ${repair.deviceTypes?.join(', ')}`,
      minPrice: 50,
      maxPrice: 400
    }).pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.message || 'Failed to register device repair technician');
        }
        return this.mapper.mapToDeviceRepair(response.data, [
          { id: 8, name: 'Appliance Repair', arabicName: 'إصلاح أجهزة', description: 'Repair of home appliances' }
        ]);
      })
    );
  }

  /**
   * Search device repair technicians by query
   */
  searchDeviceRepairs(query: string): Observable<DeviceRepair[]> {
    return this.getDeviceRepairs().pipe(
      map(repairs => repairs.filter(repair =>
        repair.name.toLowerCase().includes(query.toLowerCase()) ||
        repair.specialization.toLowerCase().includes(query.toLowerCase()) ||
        repair.address.toLowerCase().includes(query.toLowerCase()) ||
        repair.city?.toLowerCase().includes(query.toLowerCase()) ||
        repair.deviceTypes?.some(d => d.toLowerCase().includes(query.toLowerCase())) ||
        repair.brands?.some(b => b.toLowerCase().includes(query.toLowerCase())) ||
        repair.services?.some(s => s.toLowerCase().includes(query.toLowerCase()))
      ))
    );
  }

  /**
   * Get only technicians with warranty
   */
  getWarrantyDeviceRepairs(): Observable<DeviceRepair[]> {
    return this.getDeviceRepairs().pipe(
      map(repairs => repairs.filter(r => r.warranty))
    );
  }

  /**
   * Filter by device type
   */
  filterByDeviceType(deviceType: string): Observable<DeviceRepair[]> {
    return this.getDeviceRepairs().pipe(
      map(repairs => repairs.filter(r => 
        r.deviceTypes?.some(d => d.toLowerCase().includes(deviceType.toLowerCase()))
      ))
    );
  }
}