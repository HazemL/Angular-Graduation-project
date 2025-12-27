import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Plumber, PlumberRegistration } from '../../model/plumber.model';


@Injectable({
  providedIn: 'root'
})
export class PlumberService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/api/plumbers`;

  
  readonly plumbers = signal<Plumber[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  getPlumbers(): Observable<Plumber[]> {
    return this.http.get<Plumber[]>(this.apiUrl);
  }

  getPlumberById(id: number): Observable<Plumber> {
    return this.http.get<Plumber>(`${this.apiUrl}/${id}`);
  }

  registerPlumber(plumber: PlumberRegistration): Observable<Plumber> {
    return this.http.post<Plumber>(this.apiUrl, plumber);
  }

  updatePlumber(id: number, plumber: Partial<Plumber>): Observable<Plumber> {
    return this.http.put<Plumber>(`${this.apiUrl}/${id}`, plumber);
  }

  deletePlumber(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  searchPlumbers(query: string): Observable<Plumber[]> {
    return this.http.get<Plumber[]>(`${this.apiUrl}/search?q=${query}`);
  }
}