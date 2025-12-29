import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../model/craftsman-registration.model';
import { RatingSummary, ResponsePerformance } from '../../model/review.model';

export interface Review {
  id: number;
  stars: number;
  comment: string;
  isVerified: boolean;
  reviewerName: string;
}

@Injectable({ providedIn: 'root' })
export class ReviewsService {
    private readonly http = inject(HttpClient);

    private readonly baseUrl = `${environment.apiUrl}/api/craftsmen`;



    // getReviews(filter?: string, page = 1): Observable<ApiResponse<{ reviews: Review[]; totalPages: number }>> {
    //     const params: Record<string, string> = { page: page.toString() };
    //     if (filter) params['filter'] = filter;
    //     return this.http.get<ApiResponse<{ reviews: Review[]; totalPages: number }>>(this.baseUrl, { params });
    // }

    getRatingSummary(craftsmanId: string): Observable<ApiResponse<RatingSummary>> {
        return this.http.get<ApiResponse<RatingSummary>>(`${this.baseUrl}/${craftsmanId}/summary`);
    }

    getReviewss(craftsmanId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.baseUrl}/${craftsmanId}/reviews`);
  }
}
