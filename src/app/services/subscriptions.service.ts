import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../model/craftsman-registration.model';
import { SubscriptionPlan } from '../../model/subscription.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SubscriptionsService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = `${environment.apiUrl}/subscriptions`;

    getPlans(): Observable<ApiResponse<SubscriptionPlan[]>> {
        return this.http.get<ApiResponse<SubscriptionPlan[]>>(`${this.baseUrl}/plans`);
    }

    getCurrentPlan(): Observable<ApiResponse<{ planId: string; expiresAt: string }>> {
        return this.http.get<ApiResponse<{ planId: string; expiresAt: string }>>(`${this.baseUrl}/current`);
    }

    subscribe(planId: string, billingPeriod: 'monthly' | 'yearly'): Observable<ApiResponse<{ checkoutUrl: string }>> {
        return this.http.post<ApiResponse<{ checkoutUrl: string }>>(`${this.baseUrl}/subscribe`, {
            planId,
            billingPeriod
        });
    }

    cancelSubscription(): Observable<ApiResponse<void>> {
        return this.http.post<ApiResponse<void>>(`${this.baseUrl}/cancel`, {});
    }

    upgradePlan(newPlanId: string): Observable<ApiResponse<{ checkoutUrl: string }>> {
        return this.http.post<ApiResponse<{ checkoutUrl: string }>>(`${this.baseUrl}/upgrade`, { newPlanId });
    }
}
