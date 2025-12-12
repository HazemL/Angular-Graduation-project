import { Routes } from '@angular/router';
import { Home } from './components/home/home';



export const routes: Routes = [
  { path: '', component: Home },
  {path: 'home', component: Home },
  {path: '', redirectTo: 'home', pathMatch: 'full' },

  
   {
        path: 'register/craftsman',
        loadChildren: () =>
            import('./components/craftsman-registration/craftsman-registration.routes')
                .then(m => m.craftsmanRegistrationRoutes)
    },
    {
        path: 'search',
        loadChildren: () =>
            import('./components/craftsmen-search/craftsmen-search.routes')
                .then(m => m.craftsmenSearchRoutes)
    },
   
    {
        path: 'report',
        loadChildren: () =>
            import('./components/report-submission/report-submission.routes')
                .then(m => m.reportSubmissionRoutes)
    },
  
  
  // { path: '**', redirectTo: '' },

];
