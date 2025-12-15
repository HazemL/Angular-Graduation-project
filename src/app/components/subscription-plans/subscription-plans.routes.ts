import { Routes } from '@angular/router';

export const subscriptionPlansRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pricing-page/pricing-page').then(m => m.PricingPageComponent)
    },
    {
        path: 'confirmation',
        loadComponent: () => import('./confirmation/confirmation').then(m => m.ConfirmationComponent)
    }
];
