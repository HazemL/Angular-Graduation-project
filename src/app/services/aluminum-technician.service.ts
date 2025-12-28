// src/services/aluminum-technician.service.ts
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, forkJoin, map } from 'rxjs';
import { AluminumTechnician, AluminumTechnicianRegistration } from '../../model/aluminum-technician.model';
import { ApiResponse, CraftsmanApi, ProfessionApi } from '../../model/api-response.model';
import { MapperService } from './mapper.service';

@Injectable({
  providedIn: 'root'
})
export class AluminumTechnicianService {
  private readonly http = inject(HttpClient);
  private readonly mapper = inject(MapperService);
  private readonly apiUrl = `${environment.apiUrl}/api`;

  readonly aluminumTechnicians = signal<AluminumTechnician[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  /**
   * Get all aluminum technicians (filters craftsmen by aluminum installer profession)
   */
  getAluminumTechnicians(): Observable<AluminumTechnician[]> {
    return forkJoin({
      craftsmen: this.http.get<ApiResponse<CraftsmanApi[]>>(`${this.apiUrl}/craftsmen`),
      professions: this.http.get<ProfessionApi[]>(`${this.apiUrl}/professions`)
    }).pipe(
      map(({ craftsmen, professions }) => {
        if (!craftsmen.success) {
          throw new Error(craftsmen.message || 'Failed to fetch craftsmen');
        }
        return this.mapper.filterAluminumTechnicians(craftsmen.data, professions);
      })
    );
  }

  /**
   * Get aluminum technician by ID
   */
  getAluminumTechnicianById(id: number): Observable<AluminumTechnician> {
    return forkJoin({
      craftsman: this.http.get<ApiResponse<CraftsmanApi>>(`${this.apiUrl}/craftsmen/${id}`),
      professions: this.http.get<ProfessionApi[]>(`${this.apiUrl}/professions`)
    }).pipe(
      map(({ craftsman, professions }) => {
        if (!craftsman.success) {
          throw new Error(craftsman.message || 'Failed to fetch aluminum technician');
        }
        return this.mapper.mapToAluminumTechnician(craftsman.data, professions);
      })
    );
  }

  /**
   * Register new aluminum technician
   */
  registerAluminumTechnician(technician: AluminumTechnicianRegistration): Observable<AluminumTechnician> {
    return this.http.post<ApiResponse<CraftsmanApi>>(`${this.apiUrl}/craftsmen`, {
      fullName: technician.name,
      email: technician.email,
      phone: technician.phone,
      address: technician.address,
      professionId: 6, // Aluminum Installer profession ID
      experienceYears: technician.experience,
      bio: `${technician.specialization} - ${technician.warranty ? 'يوفر ضمان' : ''} - ${technician.services?.join(', ')}`,
      minPrice: 100,
      maxPrice: 500
    }).pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.message || 'Failed to register aluminum technician');
        }
        return this.mapper.mapToAluminumTechnician(response.data, [
          { id: 6, name: 'Aluminum Installer', arabicName: 'فني ألوميتال', description: 'Aluminum kitchens and windows' }
        ]);
      })
    );
  }

  /**
   * Search aluminum technicians by query
   */
  searchAluminumTechnicians(query: string): Observable<AluminumTechnician[]> {
    return this.getAluminumTechnicians().pipe(
      map(technicians => technicians.filter(tech =>
        tech.name.toLowerCase().includes(query.toLowerCase()) ||
        tech.specialization.toLowerCase().includes(query.toLowerCase()) ||
        tech.address.toLowerCase().includes(query.toLowerCase()) ||
        tech.city?.toLowerCase().includes(query.toLowerCase()) ||
        tech.services?.some(s => s.toLowerCase().includes(query.toLowerCase())) ||
        tech.materials?.some(m => m.toLowerCase().includes(query.toLowerCase()))
      ))
    );
  }

  /**
   * Get only verified aluminum technicians
   */
  getVerifiedAluminumTechnicians(): Observable<AluminumTechnician[]> {
    return this.getAluminumTechnicians().pipe(
      map(technicians => technicians.filter(t => t.isVerified))
    );
  }

  /**
   * Get technicians with warranty
   */
  getWarrantyTechnicians(): Observable<AluminumTechnician[]> {
    return this.getAluminumTechnicians().pipe(
      map(technicians => technicians.filter(t => t.warranty))
    );
  }
}