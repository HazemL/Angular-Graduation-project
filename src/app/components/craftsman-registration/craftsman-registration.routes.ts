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
    },
    {
        path: 'profession',
        loadComponent: () => import('./profession/profession').then(m => m.Profession)
    },
    {
        path: 'service-areas',
        loadComponent: () => import('./service-areas/service-areas').then(m => m.ServiceAreas)
    },
    {
        path: 'documents',
        loadComponent: () => import('./documents/documents').then(m => m.Documents)
    }
];
