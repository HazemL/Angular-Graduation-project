import { Routes } from '@angular/router';

export const reportSubmissionRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./report-form/report-form').then(m => m.ReportFormComponent)
    }
];
