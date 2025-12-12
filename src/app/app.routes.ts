import { Routes } from '@angular/router';
import { Home } from './components/home/home';
<<<<<<< HEAD


=======
import { About } from './components/about/about';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Services } from './components/services/services';
>>>>>>> 7e1f683aff7da544e1f1cf5f92fd37aa01125cfb

export const routes: Routes = [
  { path: '', component: Home },
  {path: 'home', component: Home },
  {path: '', redirectTo: 'home', pathMatch: 'full' },
<<<<<<< HEAD

=======
  {path: 'about',component:About},
  {path:'login',component:Login},
  {path:'register',component:Register},
  {path:'services',component:Services},
>>>>>>> 7e1f683aff7da544e1f1cf5f92fd37aa01125cfb
  
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
