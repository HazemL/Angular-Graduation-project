import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Craftsman, FilterOption, SearchFilters, SearchResult } from '../../model/craftsman.model';
import { ApiResponse } from '../../model/craftsman-registration.model';

@Injectable({ providedIn: 'root' })
export class CraftsmenSearchService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = '/api/craftsmen';

    search(filters: SearchFilters, page = 1, pageSize = 10): Observable<ApiResponse<SearchResult>> {
        let params = new HttpParams().set('page', page.toString()).set('pageSize', pageSize.toString());

        if (filters.profession) params = params.set('profession', filters.profession);
        if (filters.governorate) params = params.set('governorate', filters.governorate);
        if (filters.city) params = params.set('city', filters.city);
        if (filters.minPrice) params = params.set('minPrice', filters.minPrice.toString());
        if (filters.maxPrice) params = params.set('maxPrice', filters.maxPrice.toString());
        if (filters.verifiedOnly) params = params.set('verifiedOnly', 'true');
        if (filters.minRating) params = params.set('minRating', filters.minRating.toString());

        return this.http.get<ApiResponse<SearchResult>>(`${this.baseUrl}/search`, { params });
    }

    getCraftsmanById(id: string): Observable<ApiResponse<Craftsman>> {
        return this.http.get<ApiResponse<Craftsman>>(`${this.baseUrl}/${id}`);
    }

    getProfessions(): Observable<ApiResponse<FilterOption[]>> {
        return this.http.get<ApiResponse<FilterOption[]>>(`${this.baseUrl}/professions`);
    }

    getGovernorates(): Observable<ApiResponse<FilterOption[]>> {
        return this.http.get<ApiResponse<FilterOption[]>>(`${this.baseUrl}/governorates`);
    }

    getCities(governorate: string): Observable<ApiResponse<FilterOption[]>> {
        return this.http.get<ApiResponse<FilterOption[]>>(`${this.baseUrl}/cities`, {
            params: { governorate }
        });
    }
}
