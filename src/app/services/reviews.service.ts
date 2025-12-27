import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../model/craftsman-registration.model';
import { RatingSummary, ResponsePerformance, Review } from '../../model/review.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ReviewsService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = `${environment.apiUrl}/craftsman/reviews`;

    getReviews(filter?: string, page = 1): Observable<ApiResponse<{ reviews: Review[]; totalPages: number }>> {
        const params: Record<string, string> = { page: page.toString() };
        if (filter) params['filter'] = filter;
        return this.http.get<ApiResponse<{ reviews: Review[]; totalPages: number }>>(this.baseUrl, { params });
    }

    getRatingSummary(): Observable<ApiResponse<RatingSummary>> {
        return this.http.get<ApiResponse<RatingSummary>>(`${this.baseUrl}/summary`);
    }

    getResponsePerformance(): Observable<ApiResponse<ResponsePerformance>> {
        return this.http.get<ApiResponse<ResponsePerformance>>(`${this.baseUrl}/performance`);
    }

    submitReply(reviewId: string, content: string): Observable<ApiResponse<Review>> {
        return this.http.post<ApiResponse<Review>>(`${this.baseUrl}/${reviewId}/reply`, { content });
    }

    deleteReply(reviewId: string): Observable<ApiResponse<void>> {
        return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${reviewId}/reply`);
    }
}
