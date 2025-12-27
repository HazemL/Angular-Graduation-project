import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { GasTechnician, GasTechnicianRegistration } from '../../model/gas-technician.model';


@Injectable({
  providedIn: 'root'
})
export class GasTechnicianService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/api/gas-technicians`;

  
  readonly gasTechnicians = signal<GasTechnician[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  getGasTechnicians(): Observable<GasTechnician[]> {
    return this.http.get<GasTechnician[]>(this.apiUrl);
  }

  getGasTechnicianById(id: number): Observable<GasTechnician> {
    return this.http.get<GasTechnician>(`${this.apiUrl}/${id}`);
  }

  registerGasTechnician(technician: GasTechnicianRegistration): Observable<GasTechnician> {
    return this.http.post<GasTechnician>(this.apiUrl, technician);
  }

  updateGasTechnician(id: number, technician: Partial<GasTechnician>): Observable<GasTechnician> {
    return this.http.put<GasTechnician>(`${this.apiUrl}/${id}`, technician);
  }

  deleteGasTechnician(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  searchGasTechnicians(query: string): Observable<GasTechnician[]> {
    return this.http.get<GasTechnician[]>(`${this.apiUrl}/search?q=${query}`);
  }
}