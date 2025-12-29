// src/services/painter.service.ts
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, forkJoin, map } from 'rxjs';
import { Painter, PainterRegistration } from '../../model/painter.model';
import { ApiResponse, CraftsmanApi, ProfessionApi } from '../../model/api-response.model';
import { MapperService } from './mapper.service';

@Injectable({
  providedIn: 'root'
})
export class PainterService {
  private readonly http = inject(HttpClient);
  private readonly mapper = inject(MapperService);
  private readonly apiUrl = `${environment.apiUrl}/api`;

  readonly painters = signal<Painter[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  /**
   * Get all painters (filters craftsmen by painter profession)
   */
  getPainters(): Observable<Painter[]> {
    return forkJoin({
      craftsmen: this.http.get<ApiResponse<CraftsmanApi[]>>(`${this.apiUrl}/craftsmen`),
      professions: this.http.get<ProfessionApi[]>(`${this.apiUrl}/professions`)
    }).pipe(
      map(({ craftsmen, professions }) => {
        if (!craftsmen.success) {
          throw new Error(craftsmen.message || 'Failed to fetch craftsmen');
        }
        return this.mapper.filterPainters(craftsmen.data, professions);
      })
    );
  }

  /**
   * Search painters with filters (governorate, city, profession)
   * NEW METHOD - Use this for filtered searches
   */
  searchPaintersWithFilters(
    governorateId?: number,
    cityId?: number,
    name?: string
  ): Observable<Painter[]> {
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
    // Add profession filter for painters (professionId = 5)
    params = params.set('professionId', '5');

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
        return this.mapper.filterPainters(craftsmen.data, professions);
      })
    );
  }

  /**
   * Get painter by ID
   */
  getPainterById(id: number): Observable<Painter> {
    return forkJoin({
      craftsman: this.http.get<ApiResponse<CraftsmanApi>>(`${this.apiUrl}/craftsmen/${id}`),
      professions: this.http.get<ProfessionApi[]>(`${this.apiUrl}/professions`)
    }).pipe(
      map(({ craftsman, professions }) => {
        if (!craftsman.success) {
          throw new Error(craftsman.message || 'Failed to fetch painter');
        }
        return this.mapper.mapToPainter(craftsman.data, professions);
      })
    );
  }

  /**
   * Register new painter
   */
  registerPainter(painter: PainterRegistration): Observable<Painter> {
    return this.http.post<ApiResponse<CraftsmanApi>>(`${this.apiUrl}/craftsmen`, {
      fullName: painter.name,
      email: painter.email,
      phone: painter.phone,
      address: painter.address,
      professionId: 5, // Painter profession ID
      experienceYears: painter.experience,
      bio: `${painter.specialization} - ${painter.paintTypes?.join(', ')} - ${painter.techniques?.join(', ')}`,
      minPrice: 100,
      maxPrice: 500
    }).pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.message || 'Failed to register painter');
        }
        return this.mapper.mapToPainter(response.data, [
          { id: 5, name: 'Painter', arabicName: 'نقاش', description: 'Interior & exterior painting' }
        ]);
      })
    );
  }

  /**
   * Search painters by query (text search only)
   */
  searchPainters(query: string): Observable<Painter[]> {
    return this.getPainters().pipe(
      map(painters => painters.filter(painter =>
        painter.name.toLowerCase().includes(query.toLowerCase()) ||
        painter.specialization.toLowerCase().includes(query.toLowerCase()) ||
        painter.address.toLowerCase().includes(query.toLowerCase()) ||
        painter.city?.toLowerCase().includes(query.toLowerCase())
      ))
    );
  }

  /**
   * Get only verified painters
   */
  getVerifiedPainters(): Observable<Painter[]> {
    return this.getPainters().pipe(
      map(painters => painters.filter(p => p.isVerified))
    );
  }

  /**
   * Filter by governorate
   */
  filterByGovernorate(governorate: string): Observable<Painter[]> {
    return this.getPainters().pipe(
      map(painters => painters.filter(p => 
        p.governorate?.toLowerCase() === governorate.toLowerCase()
      ))
    );
  }
}