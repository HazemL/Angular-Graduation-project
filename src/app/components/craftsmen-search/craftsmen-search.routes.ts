import { Routes } from '@angular/router';

export const craftsmenSearchRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./search-results/search-results').then(m => m.SearchResultsComponent)
    }
];
