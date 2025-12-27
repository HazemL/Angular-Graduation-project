import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { ApiResponse, BasicInfoFormData, DocumentsFormData, ProfessionSkillsFormData, RegistrationResponse, ServiceAreasFormData } from '../../model/craftsman-registration.model';


@Injectable({ providedIn: 'root' })
export class CraftsmanRegistrationService {
    private http = inject(HttpClient);

    private baseUrl = `${environment.apiUrl}/api/craftsman/registration`;


    // State to track if the user is registering as a craftsman (true) or just a basic user (false)
    readonly isCraftsman = signal(true);

    submitBasicInfo(data: BasicInfoFormData): Observable<ApiResponse<RegistrationResponse>> {
        return this.http.post<ApiResponse<RegistrationResponse>>(`${this.baseUrl}/register`, data);
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

    submitProfessionSkills(data: ProfessionSkillsFormData): Observable<ApiResponse<RegistrationResponse>> {
        return this.http.post<ApiResponse<RegistrationResponse>>(`${this.baseUrl}/profession-skills`, data);
    }

    submitServiceAreas(data: ServiceAreasFormData): Observable<ApiResponse<RegistrationResponse>> {
        return this.http.post<ApiResponse<RegistrationResponse>>(`${this.baseUrl}/service-areas`, data);
    }

    submitDocuments(data: DocumentsFormData): Observable<ApiResponse<RegistrationResponse>> {
        return this.http.post<ApiResponse<RegistrationResponse>>(`${this.baseUrl}/documents`, data);
    }

    uploadDocument(file: File, type: 'nationalIdFront' | 'nationalIdBack' | 'criminalRecord'): Observable<ApiResponse<{ url: string }>> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type);
        return this.http.post<ApiResponse<{ url: string }>>(`${this.baseUrl}/upload-document`, formData);
    }

    getSkillsForProfession(profession: string): Observable<ApiResponse<string[]>> {
        return this.http.get<ApiResponse<string[]>>(`${this.baseUrl}/skills`, {
            params: { profession }
        });
    }
}
