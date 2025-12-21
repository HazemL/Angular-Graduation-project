import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Electrician, ElectricianRegistration } from '../../model/electrician.model';

@Injectable({
  providedIn: 'root'
})
export class ElectricianService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'YOUR_API_BASE_URL/api/electricians';
  
  readonly electricians = signal<Electrician[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  getElectricians(): Observable<Electrician[]> {
    return this.http.get<Electrician[]>(this.apiUrl);
  }

  getElectricianById(id: number): Observable<Electrician> {
    return this.http.get<Electrician>(`${this.apiUrl}/${id}`);
  }

  registerElectrician(electrician: ElectricianRegistration): Observable<Electrician> {
    return this.http.post<Electrician>(this.apiUrl, electrician);
  }

  updateElectrician(id: number, electrician: Partial<Electrician>): Observable<Electrician> {
    return this.http.put<Electrician>(`${this.apiUrl}/${id}`, electrician);
  }

  deleteElectrician(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  searchElectricians(query: string): Observable<Electrician[]> {
    return this.http.get<Electrician[]>(`${this.apiUrl}/search?q=${query}`);
  }
}