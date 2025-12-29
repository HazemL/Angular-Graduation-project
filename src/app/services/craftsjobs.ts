import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { inject } from '@angular/core';
import { environment } from '../../environments/environment';
export interface GalleryItem {
  id: number;
  mediaUrl: string;
  mediaType: 'Image' | 'Video';
  title: string;
}

@Injectable({
  providedIn: 'root',
})
export class Craftsjobs {
   private http = inject(HttpClient);


  private baseUrl = `${environment.apiUrl}/api/craftsmen`;


  getMyWorks(id:number): Observable<GalleryItem[]> {
    return this.http.get<GalleryItem[]>(`${this.baseUrl}/${id}/gallery`);
  
}
}
