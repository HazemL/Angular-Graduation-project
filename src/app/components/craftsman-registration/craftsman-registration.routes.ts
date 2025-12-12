import { Routes } from '@angular/router';

export const craftsmanRegistrationRoutes: Routes = [
    {
        path: '',
        redirectTo: 'basic-info',
        pathMatch: 'full'
    },
    {
        path: 'basic-info',
        loadComponent: () => import('./basic-info/basic-info').then(m => m.BasicInfoComponent)
    }
];
