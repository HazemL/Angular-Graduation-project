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

  constructor(private http: HttpClient) {}

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
      role: 'Customer'
    };
    
    // Debug: log payload so browser console shows exactly what's sent
    try {
      // eslint-disable-next-line no-console
      console.log('Craftsman register payload:', JSON.parse(JSON.stringify(payload)));
    } catch (e) {
      // ignore
    }

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
      cityId: cityId,
      // include profession and skills collected earlier
      profession: this.professionData?.professionName || this.professionData?.profession,
      skills: this.professionData?.skills,
      yearsOfExperience: this.professionData?.yearsOfExperience,
      description: this.professionData?.description,
      // include any service areas data if available
      serviceAreas: this.serviceAreasData
    };
    
    return this.http.post<ApiResponse>(`${this.apiBase}/register`, payload);
  }

  getSkillsForProfession(profession: string): Observable<ApiResponse<string[]>> {
    // Mock implementation - replace with actual API call if needed
    const mockSkills = ['مهارة 1', 'مهارة 2', 'مهارة 3', 'مهارة 4'];
    return new Observable(observer => {
      observer.next({ success: true, data: mockSkills });
      observer.complete();
    });
  }

  uploadProfilePhoto(file: File): Observable<ApiResponse> {
    const formData = new FormData();
    formData.append('photo', file);
    return this.http.post<ApiResponse>(`${this.apiBase}/upload-photo`, formData);
  }

  uploadDocument(file: File, type: string): Observable<ApiResponse> {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('type', type);
    return this.http.post<ApiResponse>(`${this.apiBase}/upload-document`, formData);
  }

  submitDocuments(data: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiBase}/submit-documents`, data);
  }

  submitBasicInfo(data: any): Observable<ApiResponse> {
    // This is just for compatibility - we'll handle it differently
    return new Observable(observer => {
      observer.next({ success: true });
      observer.complete();
    });
  }

  submitProfessionSkills(data: any): Observable<ApiResponse> {
    // This is just for compatibility - we'll handle it differently
    return new Observable(observer => {
      observer.next({ success: true });
      observer.complete();
    });
  }

  submitServiceAreas(data: any): Observable<ApiResponse> {
    // This is just for compatibility - we'll handle it differently
    return new Observable(observer => {
      observer.next({ success: true });
      observer.complete();
    });
  }

  clearRegistrationData(): void {
    this.basicInfoData = null;
    this.professionData = null;
    this.serviceAreasData = null;
  }
}