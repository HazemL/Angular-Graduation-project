// src/services/gas-technician.service.ts
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, forkJoin, map } from 'rxjs';
import { GasTechnician, GasTechnicianRegistration } from '../../model/gas-technician.model';
import { ApiResponse, CraftsmanApi, ProfessionApi } from '../../model/api-response.model';
import { MapperService } from './mapper.service';

@Injectable({
  providedIn: 'root'
})
export class GasTechnicianService {
  private readonly http = inject(HttpClient);
  private readonly mapper = inject(MapperService);
  private readonly apiUrl = `${environment.apiUrl}/api`;

  readonly gasTechnicians = signal<GasTechnician[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  /**
   * Get all gas technicians (filters craftsmen by gas technician profession)
   */
  getGasTechnicians(): Observable<GasTechnician[]> {
    return forkJoin({
      craftsmen: this.http.get<ApiResponse<CraftsmanApi[]>>(`${this.apiUrl}/craftsmen`),
      professions: this.http.get<ProfessionApi[]>(`${this.apiUrl}/professions`)
    }).pipe(
      map(({ craftsmen, professions }) => {
        if (!craftsmen.success) {
          throw new Error(craftsmen.message || 'Failed to fetch craftsmen');
        }
        return this.mapper.filterGasTechnicians(craftsmen.data, professions);
      })
    );
  }

  /**
   * Search gas technicians with filters (governorate, city, profession)
   * NEW METHOD - Use this for filtered searches
   */
  searchGasTechniciansWithFilters(
    governorateId?: number,
    cityId?: number,
    name?: string
  ): Observable<GasTechnician[]> {
    let params = new HttpParams();
    
    if (governorateId) {
      params = params.set('governorateId', governorateId.toString());
    }
    if (cityId) {
      params = params.set('cityId', cityId.toString());
    }
    if (name) {
      params = params.set('name', name);
    }
    // Add profession filter for gas technicians (professionId = 7)
    params = params.set('professionId', '7');

    return forkJoin({
      craftsmen: this.http.get<ApiResponse<CraftsmanApi[]>>(
        `${this.apiUrl}/craftsmen/search`,
        { params }
      ),
      professions: this.http.get<ProfessionApi[]>(`${this.apiUrl}/professions`)
    }).pipe(
      map(({ craftsmen, professions }) => {
        if (!craftsmen.success) {
          throw new Error(craftsmen.message || 'Failed to fetch craftsmen');
        }
        return this.mapper.filterGasTechnicians(craftsmen.data, professions);
      })
    );
  }

  /**
   * Get gas technician by ID
   */
  getGasTechnicianById(id: number): Observable<GasTechnician> {
    return forkJoin({
      craftsman: this.http.get<ApiResponse<CraftsmanApi>>(`${this.apiUrl}/craftsmen/${id}`),
      professions: this.http.get<ProfessionApi[]>(`${this.apiUrl}/professions`)
    }).pipe(
      map(({ craftsman, professions }) => {
        if (!craftsman.success) {
          throw new Error(craftsman.message || 'Failed to fetch gas technician');
        }
        return this.mapper.mapToGasTechnician(craftsman.data, professions);
      })
    );
  }

  /**
   * Register new gas technician
   */
  registerGasTechnician(technician: GasTechnicianRegistration): Observable<GasTechnician> {
    return this.http.post<ApiResponse<CraftsmanApi>>(`${this.apiUrl}/craftsmen`, {
      fullName: technician.name,
      email: technician.email,
      phone: technician.phone,
      address: technician.address,
      professionId: 7, // Gas Technician profession ID
      experienceYears: technician.experience,
      bio: `${technician.specialization} - ${technician.emergencyService ? 'خدمة طوارئ 24/7' : ''} - ${technician.certifications?.join(', ')}`,
      minPrice: 100,
      maxPrice: 500
    }).pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.message || 'Failed to register gas technician');
        }
        return this.mapper.mapToGasTechnician(response.data, [
          { id: 7, name: 'Gas Technician', arabicName: 'فني غاز', description: 'Gas systems maintenance and installation' }
        ]);
      })
    );
  }

  /**
   * Search gas technicians by query (text search only)
   */
  searchGasTechnicians(query: string): Observable<GasTechnician[]> {
    return this.getGasTechnicians().pipe(
      map(technicians => technicians.filter(tech =>
        tech.name.toLowerCase().includes(query.toLowerCase()) ||
        tech.specialization.toLowerCase().includes(query.toLowerCase()) ||
        tech.address.toLowerCase().includes(query.toLowerCase()) ||
        tech.city?.toLowerCase().includes(query.toLowerCase()) ||
        tech.services?.some(s => s.toLowerCase().includes(query.toLowerCase())) ||
        tech.certifications?.some(c => c.toLowerCase().includes(query.toLowerCase())) ||
        tech.licensedBy?.toLowerCase().includes(query.toLowerCase())
      ))
    );
  }

  /**
   * Get only verified and licensed gas technicians
   */
  getLicensedGasTechnicians(): Observable<GasTechnician[]> {
    return this.getGasTechnicians().pipe(
      map(technicians => technicians.filter(t => t.isVerified && t.licensedBy))
    );
  }

  /**
   * Get emergency service technicians
   */
  getEmergencyGasTechnicians(): Observable<GasTechnician[]> {
    return this.getGasTechnicians().pipe(
      map(technicians => technicians.filter(t => t.emergencyService))
    );
  }
}