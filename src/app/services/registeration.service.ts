import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

@Injectable({
  providedIn: 'root'
})
export class CraftsmanRegistrationService {
  private readonly apiBase = `${environment.apiUrl}/api/auth`;

  // Store registration data temporarily
  private basicInfoData: any = null;
  private professionData: any = null;
  private serviceAreasData: any = null;

  public readonly isCraftsman = signal(true);

  constructor(private http: HttpClient) { }

  setBasicInfoData(data: any): void {
    this.basicInfoData = data;
  }

  setProfessionData(data: any): void {
    this.professionData = data;
  }

  setServiceAreasData(data: any): void {
    this.serviceAreasData = data;
  }

  // Submit customer registration (direct)
  submitCustomerRegistration(data: any): Observable<ApiResponse> {
    const payload = {
      email: data.email,
      password: data.password,
      fullName: data.fullName,
      phone: data.phone,
      role: 'Customer',
      governorateId: data.governorateId || 0,
      cityId: data.cityId || 0
    };

    console.log('🔵 Customer Registration Payload:', payload);
    return this.http.post<ApiResponse>(`${this.apiBase}/register`, payload);
  }

  // Submit craftsman complete registration
  submitCraftsmanRegistration(governorateId: number, cityId: number): Observable<ApiResponse> {
    const payload = {
      email: this.basicInfoData.email,
      password: this.basicInfoData.password,
      fullName: this.basicInfoData.fullName,
      phone: this.basicInfoData.phone,
      role: 'Craftsman',
      governorateId: governorateId,
      cityId: cityId
    };

    console.log('🟢 Craftsman Registration Payload:', payload);
    return this.http.post<ApiResponse>(`${this.apiBase}/register`, payload);
  }

  getSkillsForProfession(profession: string): Observable<ApiResponse<string[]>> {
    // Mock implementation - replace with actual API call if needed
    return this.http.get<ApiResponse<string[]>>(`${this.apiBase}/skills/${profession}`);
  }

  uploadProfilePhoto(file: File): Observable<ApiResponse> {
    const formData = new FormData();
    formData.append('photo', file);
    return this.http.post<ApiResponse>(`${this.apiBase}/upload-photo`, formData);
  }

  clearRegistrationData(): void {
    this.basicInfoData = null;
    this.professionData = null;
    this.serviceAreasData = null;
  }
}