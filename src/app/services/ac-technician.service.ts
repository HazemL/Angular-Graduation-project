// src/services/ac-technician.service.ts
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, forkJoin, map } from 'rxjs';
import { AcTechnician, AcTechnicianRegistration } from '../../model/ac-technician.model';
import { ApiResponse, CraftsmanApi, ProfessionApi } from '../../model/api-response.model';
import { MapperService } from './mapper.service';

@Injectable({
  providedIn: 'root'
})
export class AcTechnicianService {
  private readonly http = inject(HttpClient);
  private readonly mapper = inject(MapperService);
  private readonly apiUrl = `${environment.apiUrl}/api`;

  readonly acTechnicians = signal<AcTechnician[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  /**
   * Get all AC technicians (filters craftsmen by AC technician profession)
   */
  getAcTechnicians(): Observable<AcTechnician[]> {
    return forkJoin({
      craftsmen: this.http.get<ApiResponse<CraftsmanApi[]>>(`${this.apiUrl}/craftsmen`),
      professions: this.http.get<ProfessionApi[]>(`${this.apiUrl}/professions`)
    }).pipe(
      map(({ craftsmen, professions }) => {
        if (!craftsmen.success) {
          throw new Error(craftsmen.message || 'Failed to fetch craftsmen');
        }
        return this.mapper.filterAcTechnicians(craftsmen.data, professions);
      })
    );
  }

  /**
   * Get AC technician by ID
   */
  getAcTechnicianById(id: number): Observable<AcTechnician> {
    return forkJoin({
      craftsman: this.http.get<ApiResponse<CraftsmanApi>>(`${this.apiUrl}/craftsmen/${id}`),
      professions: this.http.get<ProfessionApi[]>(`${this.apiUrl}/professions`)
    }).pipe(
      map(({ craftsman, professions }) => {
        if (!craftsman.success) {
          throw new Error(craftsman.message || 'Failed to fetch AC technician');
        }
        return this.mapper.mapToAcTechnician(craftsman.data, professions);
      })
    );
  }

  /**
   * Register new AC technician
   */
  registerAcTechnician(technician: AcTechnicianRegistration): Observable<AcTechnician> {
    return this.http.post<ApiResponse<CraftsmanApi>>(`${this.apiUrl}/craftsmen`, {
      fullName: technician.name,
      email: technician.email,
      phone: technician.phone,
      address: technician.address,
      professionId: 5, // AC Technician profession ID
      experienceYears: technician.experience,
      bio: `${technician.specialization} - ${technician.brands?.join(', ')} - ${technician.emergencyService ? 'خدمة طوارئ 24/7' : ''}`,
      minPrice: 100,
      maxPrice: 500
    }).pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.message || 'Failed to register AC technician');
        }
        return this.mapper.mapToAcTechnician(response.data, [
          { id: 5, name: 'AC Technician', arabicName: 'فني تكييف', description: 'AC repair & maintenance' }
        ]);
      })
    );
  }

  /**
   * Search AC technicians by query
   */
  searchAcTechnicians(query: string): Observable<AcTechnician[]> {
    return this.getAcTechnicians().pipe(
      map(technicians => technicians.filter(tech =>
        tech.name.toLowerCase().includes(query.toLowerCase()) ||
        tech.specialization.toLowerCase().includes(query.toLowerCase()) ||
        tech.address.toLowerCase().includes(query.toLowerCase()) ||
        tech.city?.toLowerCase().includes(query.toLowerCase()) ||
        tech.brands?.some(b => b.toLowerCase().includes(query.toLowerCase())) ||
        tech.services?.some(s => s.toLowerCase().includes(query.toLowerCase()))
      ))
    );
  }

  /**
   * Get only verified AC technicians
   */
  getVerifiedAcTechnicians(): Observable<AcTechnician[]> {
    return this.getAcTechnicians().pipe(
      map(technicians => technicians.filter(t => t.isVerified))
    );
  }

  /**
   * Get emergency service technicians
   */
  getEmergencyAcTechnicians(): Observable<AcTechnician[]> {
    return this.getAcTechnicians().pipe(
      map(technicians => technicians.filter(t => t.emergencyService))
    );
  }

  /**
   * Filter by brand
   */
  filterByBrand(brand: string): Observable<AcTechnician[]> {
    return this.getAcTechnicians().pipe(
      map(technicians => technicians.filter(t => 
        t.brands?.some(b => b.toLowerCase().includes(brand.toLowerCase()))
      ))
    );
  }
}