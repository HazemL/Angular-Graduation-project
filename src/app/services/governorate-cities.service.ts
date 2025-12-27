import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GovernorateCitiesService {
  private readonly apiBase = `${environment.apiUrl}/api`;

  constructor(private http: HttpClient) { }

  /** Get all governorates from API */
  getGovernorates(): Observable<{ id: number; name: string; arabicName: string }[]> {
    return this.http.get<{ id: number; name: string; arabicName: string }[]>(`${this.apiBase}/governorates`).pipe(
      catchError(() => of([]))
    );
  }

  /** Get only governorate names */
  getGovernorateNames(): Observable<string[]> {
    return this.getGovernorates().pipe(
      map(list => list.map(g => g.name))
    );
  }

  /** Get all cities from API */
  getCities(): Observable<{ id: number; name: string; arabicName: string; governorateName: string; governorateArabicName: string }[]> {
    return this.http.get<{ id: number; name: string; arabicName: string; governorateName: string; governorateArabicName: string }[]>(`${this.apiBase}/cities`).pipe(
      catchError(() => of([]))
    );
  }

  /** Get cities filtered by governorate name */
  getCitiesByGovernorate(governorate: string): Observable<{ id: number; name: string; arabicName: string; governorateName: string; governorateArabicName: string }[]> {
    return this.getCities().pipe(
      map(cities => cities.filter(c => c.governorateName === governorate))
    );
  }

  /** Get only city names for a governorate */
  getCityNamesByGovernorate(governorate: string): Observable<string[]> {
    return this.getCitiesByGovernorate(governorate).pipe(
      map(cities => cities.map(c => c.name))
    );
  }

  /** Check if a governorate exists */
  hasGovernorate(governorate: string): Observable<boolean> {
    return this.getGovernorates().pipe(
      map(list => list.some(g => g.name === governorate))
    );
  }

  /** Check if a city exists in a governorate */
  hasCityInGovernorate(governorate: string, city: string): Observable<boolean> {
    return this.getCitiesByGovernorate(governorate).pipe(
      map(cities => cities.some(c => c.name === city))
    );
  }
}
