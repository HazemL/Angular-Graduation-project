import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { About } from './components/about/about';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Services } from './components/services/services';
import { Dashboard } from './components/dashboard/dashboard';
import { CraftsmanDashboard } from './components/craftsman-dashboard/craftsman-dashboard';
import { CraftsmanProfile } from './components/craftsman-profile/craftsman-profile';
import { PlumberList } from './components/plumber-list/plumber-list';

export const routes: Routes = [
  { path: '', component: Home },
  {path: 'home', component: Home },
  {path: '', redirectTo: 'home', pathMatch: 'full' },
  {path: 'about',component:About},
  {path:'login',component:Login},
  {path:'register',component:Register},
  {path:'services',component:Services},
  {path: 'dashboard',component: Dashboard},
  {path:'craftsman-dashboard',component:CraftsmanDashboard},
  {path:'craftsman-profile',component:CraftsmanProfile},
  
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
    {
    path: 'plumber',
    loadComponent: () => import('./components/plumber-list/plumber-list').then(m => m.PlumberList),
    title: 'سباك - إصلاح وتركيب'
  },
    {
        path: 'reviews',
        loadChildren: () =>
            import('./components/reviews-management/reviews-management.routes')
                .then(m => m.reviewsManagementRoutes)
    },
    {
    path: 'electrician',
    loadComponent: () => import('./components/electrician-list/electrician-list').then(m => m.ElectricianList),
    title: 'كهربائي - صيانة وتأسيس'
  },
       {
        path: 'pricing',
        loadChildren: () =>
            import('./components/subscription-plans/subscription-plans.routes')
                .then(m => m.subscriptionPlansRoutes)
    },
  {
    path: 'carpenter',
    loadComponent: () => import('./components/carpenter-list/carpenter-list').then(m => m.CarpenterList),
    title: 'نجار - تصنيع وتركيب'
  },
    {
    path: 'ac-technician',
    loadComponent: () => import('./components/ac-technician-list/ac-technician-list').then(m => m.AcTechnicianList),
    title: 'فني تكييف - شحن وصيانة'
  },
    {
    path: 'painter',
    loadComponent: () => import('./components/painter-list/painter-list').then(m => m.PainterList),
    title: 'نقاش - دهانات وتشطيبات'
  },
  {
    path: 'aluminum-technician',
    loadComponent: () => import('./components/aluminum-technician-list/aluminum-technician-list').then(m => m.AluminumTechnicianList),
    title: 'فني ألوميتال - مطابخ وشبابيك'
  },
  // { path: '**', redirectTo: '' },

];
