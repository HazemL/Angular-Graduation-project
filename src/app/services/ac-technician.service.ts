import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { AcTechnician, AcTechnicianRegistration } from '../../model/ac-technician.model';


@Injectable({
  providedIn: 'root'
})
export class AcTechnicianService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/api/ac-technicians`;

  
  readonly acTechnicians = signal<AcTechnician[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  getAcTechnicians(): Observable<AcTechnician[]> {
    return this.http.get<AcTechnician[]>(this.apiUrl);
  }

  getAcTechnicianById(id: number): Observable<AcTechnician> {
    return this.http.get<AcTechnician>(`${this.apiUrl}/${id}`);
  }

  registerAcTechnician(technician: AcTechnicianRegistration): Observable<AcTechnician> {
    return this.http.post<AcTechnician>(this.apiUrl, technician);
  }

  updateAcTechnician(id: number, technician: Partial<AcTechnician>): Observable<AcTechnician> {
    return this.http.put<AcTechnician>(`${this.apiUrl}/${id}`, technician);
  }

  deleteAcTechnician(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  searchAcTechnicians(query: string): Observable<AcTechnician[]> {
    return this.http.get<AcTechnician[]>(`${this.apiUrl}/search?q=${query}`);
  }
}