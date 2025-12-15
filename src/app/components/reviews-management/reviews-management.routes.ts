import { Routes } from '@angular/router';

export const reviewsManagementRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./reviews-page/reviews-page').then(m => m.ReviewsPageComponent)
    }
];
