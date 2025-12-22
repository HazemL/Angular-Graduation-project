import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class CraftsService {
  
  private apiUrl = 'http://localhost:3000/crafts';
  constructor(private http: HttpClient) {}
  getCrafts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
