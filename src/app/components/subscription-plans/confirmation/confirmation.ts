import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

interface SubscriptionDetails {
    planName: string;
    price: string;
    activationDate: string;
    renewalDate: string;
}

@Component({
    selector: 'app-confirmation',
    templateUrl: './confirmation.html',
    styleUrl: './confirmation.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: []
})
export class ConfirmationComponent {
    private readonly router = inject(Router);

    protected readonly userImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCRm5cgFWjgOvGDiptmR6tTqAIcsRJwBmVIYXofNHT5ljFe2pEYq0T6b0yWM_oOXQdrEngUXWVJaC_d25G236zbYhyt6_RiatOCO9_D7rRFiHqUiLMts1CN6cKZRilUbfTrna7DtsKx6DnHDyPf7tfhHxn8C0TONWvVxizBECdw4frTSeWBQRFH3A8qEdj5ckYsf6jFMkNEfQWqZnkv0dcD7-Df9SPqCdie_d5ATj0fj0_G2CffwH-2vmY8pRPKfjioZTQbGCsKCSSW';

    protected readonly subscriptionDetails: SubscriptionDetails = {
        planName: 'الاحترافية',
        price: '299 جنيه / شهرياً',
        activationDate: '27 أكتوبر 2023',
        renewalDate: '27 نوفمبر 2023'
    };

    goToDashboard(): void {
        this.router.navigate(['/dashboard']);
    }

    goToSubscriptionDetails(): void {
        this.router.navigate(['/subscription']);
    }
}
