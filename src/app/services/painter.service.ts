import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Painter, PainterRegistration } from '../../model/painter.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PainterService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/painters`;
  
  readonly painters = signal<Painter[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  getPainters(): Observable<Painter[]> {
    return this.http.get<Painter[]>(this.apiUrl);
  }

  getPainterById(id: number): Observable<Painter> {
    return this.http.get<Painter>(`${this.apiUrl}/${id}`);
  }

  registerPainter(painter: PainterRegistration): Observable<Painter> {
    return this.http.post<Painter>(this.apiUrl, painter);
  }

  updatePainter(id: number, painter: Partial<Painter>): Observable<Painter> {
    return this.http.put<Painter>(`${this.apiUrl}/${id}`, painter);
  }

  deletePainter(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  searchPainters(query: string): Observable<Painter[]> {
    return this.http.get<Painter[]>(`${this.apiUrl}/search?q=${query}`);
  }
}