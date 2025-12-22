import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { inject } from '@angular/core';
export interface job {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class Craftsjobs {
   private http = inject(HttpClient);
  private baseUrl = '/api/crafts-jobs';

  getMyWorks(): Observable<job[]> {
    return this.http.get<job[]>(`${this.baseUrl}/my`);
  
}
}
