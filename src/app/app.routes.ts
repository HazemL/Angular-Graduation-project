import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { About } from './components/about/about';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Services } from './components/services/services';

export const routes: Routes = [
  { path: '', component: Home },
  {path: 'home', component: Home },
  {path: '', redirectTo: 'home', pathMatch: 'full' },
  {path: 'about',component:About},
  {path:'login',component:Login},
  {path:'register',component:Register},
  {path:'services',component:Services},
  { path: '**', redirectTo: '' },

];
