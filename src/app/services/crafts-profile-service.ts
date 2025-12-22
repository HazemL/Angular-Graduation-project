import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { inject } from '@angular/core';
export interface CraftsProfile {
  id: string;
  name: string;
  job: string;
  rating: number;
  successfulJobs: number;
  experienceYears: number;
  verified: boolean;
  premium: boolean;
  about: string;
  gallery: string[];
  skills: string[];
  avatarUrl: string;
}

@Injectable({
  providedIn: 'root',
})

export class CraftsProfileService {
  
    private http = inject(HttpClient);
  private baseUrl = '/api/crafts-profile';

  getProfile(workerId: string): Observable<CraftsProfile> {
    return this.http.get<CraftsProfile>(`${this.baseUrl}/${workerId}`);
}
}