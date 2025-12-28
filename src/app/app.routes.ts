import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { About } from './components/about/about';
import { Login } from './components/login/login';
import { Services } from './components/services/services';
import { Dashboard } from './components/dashboard/dashboard';
import { CraftsmanDashboard } from './components/craftsman-dashboard/craftsman-dashboard';
import { CraftsmanProfile } from './components/craftsman-profile/craftsman-profile';
import { PlumberList } from './components/plumber-list/plumber-list';
import { ContactUs } from './components/contact-us/contact-us';

export const routes: Routes = [
  { path: '', component: Home },
  {path: 'home', component: Home },
  {path: '', redirectTo: 'home', pathMatch: 'full' },
  {path: 'about',component:About},
  {path:'login',component:Login},
   { path: 'contact', component: ContactUs },
 
  {path:'services',component:Services},
  {path: 'dashboard',component: Dashboard,
    children: [
      {
        path: 'users',
        loadComponent: () => import('./components/dashboard/users/users').then(m => m.UsersComponent) 
      },
      {
        path:'dashCraft',
        loadComponent:() => import('./components/dashboard/dash-craftsman/dash-craftsman').then(m=>m.DashCraftsman)
      },
      {
        path:'reports',
        loadComponent:() => import('./components/dashboard/dashreports/dashreports').then(m=>m.Dashreports) 
      }
      
    ]
  },
  {path:'craftsman-dashboard',component:CraftsmanDashboard,
    children: [
      {path:'profile', loadComponent: () => import('./components/craftsman-dashboard/dashprofile/dashprofile').then(m => m.Dashprofile)},
      {path:'jobs-collection', loadComponent: () => import('./components/craftsman-dashboard/jobs-collection/jobs-collection').then(m => m.JobsCollection)},
      {path:'reviews', loadComponent: () => import('./components/reviews-management/reviews-page/reviews-page').then(m => m.ReviewsPageComponent)}
    ]
    
  },
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
  {
path: 'gas-technician',
loadComponent: () => import('./components/gas-technician-list/gas-technician-list').then(m => m.GasTechnicianList),
title: 'فني غاز - صيانة وتركيب'
},
{
path: 'device-repair',
loadComponent: () => import('./components/device-repair-list/device-repair-list').then(m => m.DeviceRepairList),
title: 'إصلاح أجهزة - غسالات وثلاجات'
},
  // { path: '**', redirectTo: '' },

];
