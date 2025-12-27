import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { AluminumTechnician, AluminumTechnicianRegistration } from '../../model/aluminum-technician.model';


@Injectable({
  providedIn: 'root'
})
export class AluminumTechnicianService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/api/aluminum-technicians`;

  
  readonly aluminumTechnicians = signal<AluminumTechnician[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  getAluminumTechnicians(): Observable<AluminumTechnician[]> {
    return this.http.get<AluminumTechnician[]>(this.apiUrl);
  }

  getAluminumTechnicianById(id: number): Observable<AluminumTechnician> {
    return this.http.get<AluminumTechnician>(`${this.apiUrl}/${id}`);
  }

  registerAluminumTechnician(technician: AluminumTechnicianRegistration): Observable<AluminumTechnician> {
    return this.http.post<AluminumTechnician>(this.apiUrl, technician);
  }

  updateAluminumTechnician(id: number, technician: Partial<AluminumTechnician>): Observable<AluminumTechnician> {
    return this.http.put<AluminumTechnician>(`${this.apiUrl}/${id}`, technician);
  }

  deleteAluminumTechnician(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  searchAluminumTechnicians(query: string): Observable<AluminumTechnician[]> {
    return this.http.get<AluminumTechnician[]>(`${this.apiUrl}/search?q=${query}`);
  }
}