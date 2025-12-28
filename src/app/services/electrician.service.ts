// src/services/electrician.service.ts
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, forkJoin, map } from 'rxjs';
import { Electrician, ElectricianRegistration } from '../../model/electrician.model';
import { ApiResponse, CraftsmanApi, ProfessionApi } from '../../model/api-response.model';
import { MapperService } from './mapper.service';

@Injectable({
  providedIn: 'root'
})
export class ElectricianService {
  private readonly http = inject(HttpClient);
  private readonly mapper = inject(MapperService);
  private readonly apiUrl = `${environment.apiUrl}/api`;

  readonly electricians = signal<Electrician[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  /**
   * Get all electricians (filters craftsmen by electrician profession)
   */
  getElectricians(): Observable<Electrician[]> {
    return forkJoin({
      craftsmen: this.http.get<ApiResponse<CraftsmanApi[]>>(`${this.apiUrl}/craftsmen`),
      professions: this.http.get<ProfessionApi[]>(`${this.apiUrl}/professions`)
    }).pipe(
      map(({ craftsmen, professions }) => {
        if (!craftsmen.success) {
          throw new Error(craftsmen.message || 'Failed to fetch craftsmen');
        }
        return this.mapper.filterElectricians(craftsmen.data, professions);
      })
    );
  }

  /**
   * Get electrician by ID
   */
  getElectricianById(id: number): Observable<Electrician> {
    return forkJoin({
      craftsman: this.http.get<ApiResponse<CraftsmanApi>>(`${this.apiUrl}/craftsmen/${id}`),
      professions: this.http.get<ProfessionApi[]>(`${this.apiUrl}/professions`)
    }).pipe(
      map(({ craftsman, professions }) => {
        if (!craftsman.success) {
          throw new Error(craftsman.message || 'Failed to fetch electrician');
        }
        return this.mapper.mapToElectrician(craftsman.data, professions);
      })
    );
  }

  /**
   * Register new electrician
   */
  registerElectrician(electrician: ElectricianRegistration): Observable<Electrician> {
    return this.http.post<ApiResponse<CraftsmanApi>>(`${this.apiUrl}/craftsmen`, {
      fullName: electrician.name,
      email: electrician.email,
      phone: electrician.phone,
      address: electrician.address,
      professionId: 2, // Electrician profession ID
      experienceYears: electrician.experience,
      bio: `${electrician.specialization} - ${electrician.certifications?.join(', ')}`,
      minPrice: 100,
      maxPrice: 500
    }).pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.message || 'Failed to register electrician');
        }
        return this.mapper.mapToElectrician(response.data, [
          { id: 2, name: 'Electrician', arabicName: 'فني كهرباء', description: 'Electrical installation & repair' }
        ]);
      })
    );
  }

  /**
   * Search electricians by query
   */
  searchElectricians(query: string): Observable<Electrician[]> {
    return this.getElectricians().pipe(
      map(electricians => electricians.filter(elec =>
        elec.name.toLowerCase().includes(query.toLowerCase()) ||
        elec.specialization.toLowerCase().includes(query.toLowerCase()) ||
        elec.address.toLowerCase().includes(query.toLowerCase()) ||
        elec.city?.toLowerCase().includes(query.toLowerCase()) ||
        elec.certifications?.some(c => c.toLowerCase().includes(query.toLowerCase()))
      ))
    );
  }

  /**
   * Get only verified electricians
   */
  getVerifiedElectricians(): Observable<Electrician[]> {
    return this.getElectricians().pipe(
      map(electricians => electricians.filter(e => e.isVerified))
    );
  }

  /**
   * Filter by certification
   */
  filterByCertification(certification: string): Observable<Electrician[]> {
    return this.getElectricians().pipe(
      map(electricians => electricians.filter(e => 
        e.certifications?.some(c => c.toLowerCase().includes(certification.toLowerCase()))
      ))
    );
  }
}