import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../model/craftsman-registration.model';
import { ReportFormData, ReportType } from '../../model/report.model';


@Injectable({ providedIn: 'root' })
export class ReportsService {
    private readonly http = inject(HttpClient);

    private readonly baseUrl = `${environment.apiUrl}/api/reports`;


    submitReport(data: ReportFormData): Observable<ApiResponse<{ reportId: string }>> {
        return this.http.post<ApiResponse<{ reportId: string }>>(this.baseUrl, data);
    }

    uploadAttachment(file: File): Observable<ApiResponse<{ fileUrl: string }>> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post<ApiResponse<{ fileUrl: string }>>(`${this.baseUrl}`, formData);
    }

    getReportTypes(): Observable<ApiResponse<ReportType[]>> {
        return this.http.get<ApiResponse<ReportType[]>>(`${this.baseUrl}/types`);
    }

    getReportStatus(reportId: string): Observable<ApiResponse<{ status: string; updatedAt: string }>> {
        return this.http.get<ApiResponse<{ status: string; updatedAt: string }>>(`${this.baseUrl}/${reportId}`);
    }
    
  getReports(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

updateReportStatus(
  reportId: string,
  status: 'pending' | 'resolved' | 'rejected'
): Observable<ApiResponse<any>> {
  return this.http.patch<ApiResponse<any>>(
    `${this.baseUrl}/${reportId}`,
    { status }
  );
}

}
