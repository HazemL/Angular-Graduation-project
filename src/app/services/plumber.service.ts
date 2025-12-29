// src/services/plumber.service.ts
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, forkJoin, map } from 'rxjs';
import { Plumber, PlumberRegistration } from '../../model/plumber.model';
import { ApiResponse, CraftsmanApi, ProfessionApi } from '../../model/api-response.model';
import { MapperService } from './mapper.service';

@Injectable({
  providedIn: 'root'
})
export class PlumberService {
  private readonly http = inject(HttpClient);
  private readonly mapper = inject(MapperService);
  private readonly apiUrl = `${environment.apiUrl}/api`;

  readonly plumbers = signal<Plumber[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  /**
   * Get all plumbers (filters craftsmen by plumber profession)
   */
  getPlumbers(): Observable<Plumber[]> {
    return forkJoin({
      craftsmen: this.http.get<ApiResponse<CraftsmanApi[]>>(`${this.apiUrl}/craftsmen`),
      professions: this.http.get<ProfessionApi[]>(`${this.apiUrl}/professions`)
    }).pipe(
      map(({ craftsmen, professions }) => {
        if (!craftsmen.success) {
          throw new Error(craftsmen.message || 'Failed to fetch craftsmen');
        }
        return this.mapper.filterPlumbers(craftsmen.data, professions);
      })
    );
  }

  /**
   * Search plumbers with filters (governorate, city, profession)
   * NEW METHOD - Use this for filtered searches
   */
  searchPlumbersWithFilters(
    governorateId?: number,
    cityId?: number,
    name?: string
  ): Observable<Plumber[]> {
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
    // Add profession filter for plumbers (professionId = 1)
    params = params.set('professionId', '1');

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
        return this.mapper.filterPlumbers(craftsmen.data, professions);
      })
    );
  }

  /**
   * Get plumber by ID
   */
  getPlumberById(id: number): Observable<Plumber> {
    return forkJoin({
      craftsman: this.http.get<ApiResponse<CraftsmanApi>>(`${this.apiUrl}/craftsmen/${id}`),
      professions: this.http.get<ProfessionApi[]>(`${this.apiUrl}/professions`)
    }).pipe(
      map(({ craftsman, professions }) => {
        if (!craftsman.success) {
          throw new Error(craftsman.message || 'Failed to fetch plumber');
        }
        return this.mapper.mapToPlumber(craftsman.data, professions);
      })
    );
  }

  /**
   * Register new plumber
   */
  registerPlumber(plumber: PlumberRegistration): Observable<Plumber> {
    return this.http.post<ApiResponse<CraftsmanApi>>(`${this.apiUrl}/craftsmen`, {
      fullName: plumber.name,
      email: plumber.email,
      phone: plumber.phone,
      address: plumber.address,
      professionId: 1, // Plumber profession ID
      experienceYears: plumber.experience,
      bio: `${plumber.specialization}`,
      minPrice: 100,
      maxPrice: 500
    }).pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.message || 'Failed to register plumber');
        }
        return this.mapper.mapToPlumber(response.data, [
          { id: 1, name: 'Plumber', arabicName: 'سباك', description: 'Plumbing and installations' }
        ]);
      })
    );
  }

  /**
   * Search plumbers by query (text search only)
   */
  searchPlumbers(query: string): Observable<Plumber[]> {
    return this.getPlumbers().pipe(
      map(plumbers => plumbers.filter(plumber =>
        plumber.name.toLowerCase().includes(query.toLowerCase()) ||
        plumber.specialization.toLowerCase().includes(query.toLowerCase()) ||
        plumber.address.toLowerCase().includes(query.toLowerCase()) ||
        plumber.city?.toLowerCase().includes(query.toLowerCase()) ||
        plumber.services?.some(s => s.toLowerCase().includes(query.toLowerCase()))
      ))
    );
  }

  /**
   * Get only verified plumbers
   */
  getVerifiedPlumbers(): Observable<Plumber[]> {
    return this.getPlumbers().pipe(
      map(plumbers => plumbers.filter(p => p.isVerified))
    );
  }

  /**
   * Filter by governorate
   */
  filterByGovernorate(governorate: string): Observable<Plumber[]> {
    return this.getPlumbers().pipe(
      map(plumbers => plumbers.filter(p => 
        p.governorate?.toLowerCase() === governorate.toLowerCase()
      ))
    );
  }
}