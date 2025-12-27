// src/services/carpenter.service.ts
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, forkJoin, map } from 'rxjs';
import { Carpenter, CarpenterRegistration } from '../../model/carpenter.model';
import { ApiResponse, CraftsmanApi, ProfessionApi } from '../../model/api-response.model';
import { MapperService } from './mapper.service';


@Injectable({
  providedIn: 'root'
})
export class CarpenterService {
  private readonly http = inject(HttpClient);
  private readonly mapper = inject(MapperService);
  private readonly apiUrl = `${environment.apiUrl}/api`;

  
  readonly carpenters = signal<Carpenter[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  /**
   * Get all carpenters (filters craftsmen by carpenter profession)
   */
  getCarpenters(): Observable<Carpenter[]> {
    return forkJoin({
      craftsmen: this.http.get<ApiResponse<CraftsmanApi[]>>(`${this.apiUrl}/craftsmen`),
      professions: this.http.get<ProfessionApi[]>(`${this.apiUrl}/professions`)
    }).pipe(
      map(({ craftsmen, professions }) => {
        if (!craftsmen.success) {
          throw new Error(craftsmen.message || 'Failed to fetch craftsmen');
        }
        return this.mapper.filterCarpenters(craftsmen.data, professions);
      })
    );
  }

  /**
   * Get carpenter by ID
   */
  getCarpenterById(id: number): Observable<Carpenter> {
    return forkJoin({
      craftsman: this.http.get<ApiResponse<CraftsmanApi>>(`${this.apiUrl}/craftsmen/${id}`),
      professions: this.http.get<ProfessionApi[]>(`${this.apiUrl}/professions`)
    }).pipe(
      map(({ craftsman, professions }) => {
        if (!craftsman.success) {
          throw new Error(craftsman.message || 'Failed to fetch carpenter');
        }
        return this.mapper.mapToCarpenter(craftsman.data, professions);
      })
    );
  }

  /**
   * Register new carpenter
   */
  registerCarpenter(carpenter: CarpenterRegistration): Observable<Carpenter> {
    // You'll need to adapt this based on your actual registration API endpoint
    return this.http.post<ApiResponse<CraftsmanApi>>(`${this.apiUrl}/craftsmen`, {
      fullName: carpenter.name,
      email: carpenter.email,
      phone: carpenter.phone,
      address: carpenter.address,
      professionId: 2, // Carpenter profession ID from your data
      experienceYears: carpenter.experience,
      bio: `${carpenter.specialization} - ${carpenter.services?.join(', ')}`,
      minPrice: 100,
      maxPrice: 500
    }).pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.message || 'Failed to register carpenter');
        }
        return this.mapper.mapToCarpenter(response.data, [
          { id: 2, name: 'Carpenter', arabicName: 'نجار', description: 'Wood works & furniture' }
        ]);
      })
    );
  }

  /**
   * Search carpenters by query
   */
  searchCarpenters(query: string): Observable<Carpenter[]> {
    return this.getCarpenters().pipe(
      map(carpenters => carpenters.filter(carpenter =>
        carpenter.name.toLowerCase().includes(query.toLowerCase()) ||
        carpenter.specialization.toLowerCase().includes(query.toLowerCase()) ||
        carpenter.address.toLowerCase().includes(query.toLowerCase()) ||
        carpenter.city?.toLowerCase().includes(query.toLowerCase())
      ))
    );
  }

  /**
   * Filter carpenters by governorate
   */
  filterByGovernorate(governorate: string): Observable<Carpenter[]> {
    return this.getCarpenters().pipe(
      map(carpenters => carpenters.filter(c => 
        c.governorate?.toLowerCase() === governorate.toLowerCase()
      ))
    );
  }

  /**
   * Filter carpenters by price range
   */
  filterByPriceRange(minPrice?: number, maxPrice?: number): Observable<Carpenter[]> {
    return this.getCarpenters().pipe(
      map(carpenters => carpenters.filter(c => {
        if (minPrice && c.minPrice && c.minPrice < minPrice) return false;
        if (maxPrice && c.maxPrice && c.maxPrice > maxPrice) return false;
        return true;
      }))
    );
  }

  /**
   * Get only verified carpenters
   */
  getVerifiedCarpenters(): Observable<Carpenter[]> {
    return this.getCarpenters().pipe(
      map(carpenters => carpenters.filter(c => c.isVerified))
    );
  }
}