import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, BasicInfoFormData, RegistrationResponse } from '../../model/craftsman-registration.model';

@Injectable({ providedIn: 'root' })
export class CraftsmanRegistrationService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = '/api/craftsman/registration';

    submitBasicInfo(data: BasicInfoFormData): Observable<ApiResponse<RegistrationResponse>> {
        return this.http.post<ApiResponse<RegistrationResponse>>(`${this.baseUrl}/basic-info`, data);
    }

    uploadProfilePhoto(file: File): Observable<ApiResponse<{ photoUrl: string }>> {
        const formData = new FormData();
        formData.append('photo', file);
        return this.http.post<ApiResponse<{ photoUrl: string }>>(`${this.baseUrl}/upload-photo`, formData);
    }

    checkEmailAvailability(email: string): Observable<ApiResponse<{ available: boolean }>> {
        return this.http.get<ApiResponse<{ available: boolean }>>(`${this.baseUrl}/check-email`, {
            params: { email }
        });
    }

    checkPhoneAvailability(phone: string): Observable<ApiResponse<{ available: boolean }>> {
        return this.http.get<ApiResponse<{ available: boolean }>>(`${this.baseUrl}/check-phone`, {
            params: { phone }
        });
    }
}
