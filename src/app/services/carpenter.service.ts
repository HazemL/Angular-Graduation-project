import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Carpenter, CarpenterRegistration } from '../../model/carpenter.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CarpenterService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/carpenters`;
  
  readonly carpenters = signal<Carpenter[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  getCarpenters(): Observable<Carpenter[]> {
    return this.http.get<Carpenter[]>(this.apiUrl);
  }

  getCarpenterById(id: number): Observable<Carpenter> {
    return this.http.get<Carpenter>(`${this.apiUrl}/${id}`);
  }

  registerCarpenter(carpenter: CarpenterRegistration): Observable<Carpenter> {
    return this.http.post<Carpenter>(this.apiUrl, carpenter);
  }

  updateCarpenter(id: number, carpenter: Partial<Carpenter>): Observable<Carpenter> {
    return this.http.put<Carpenter>(`${this.apiUrl}/${id}`, carpenter);
  }

  deleteCarpenter(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  searchCarpenters(query: string): Observable<Carpenter[]> {
    return this.http.get<Carpenter[]>(`${this.apiUrl}/search?q=${query}`);
  }
}