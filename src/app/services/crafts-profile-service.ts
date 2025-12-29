import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface CraftsProfile {
  id: number;
  userId: number;
  fullName: string;
  phone: string;
  profileImageUrl: string | null;
  governorateName: string;
  cityName: string;
  professionId: number;
  bio: string;
  experienceYears: number;
  minPrice: number;
  maxPrice: number;
  isVerified: boolean;
  verificationDate: string | null;
}
export interface Profession {
  id: number;
  name: string;
  arabicName: string;
  description: string;
}

@Injectable({
  providedIn: 'root',
})
export class CraftsProfileService {

  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/api/craftsmen`;
private baseUrl2 = `${environment.apiUrl}/api/professions`;

  getCraftsmanProfile(id: number): Observable<{ success: boolean; data: CraftsProfile }> {
    return this.http.get<{ success: boolean; data: CraftsProfile }>(
      `${this.baseUrl}/${id}`
    );
  }
 getProfessionById(id: number): Observable<Profession> {
  return this.http.get<Profession>(`${this.baseUrl2}/${id}`);
}
getCraftsmanId(id: number): Observable<number> {
  return this.http.get<{ success: boolean; data: CraftsProfile }>(`${this.baseUrl}/${id}`)
    .pipe(
     
      map(res => res.data.id)
    );
}
}
