import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';




@Injectable({
  providedIn: 'root',
})
export class CraftsService {

  
  private apiUrl = `${environment.apiUrl}/api/craftsmen`;
     private apiUrl2 = `${environment.apiUrl}/api/professions`;


  constructor(private http: HttpClient) {}
  getCrafts(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
    getCraftNameById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl2}/${id}`);
}
getRatingsByCraftsmanId(craftsmanId: number) {
  return this.http.get<any[]>(`${this.apiUrl}/${craftsmanId}/reviews`);
}
}
