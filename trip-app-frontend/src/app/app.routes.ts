import { Routes } from '@angular/router';
import { TripList } from './pages/trip-list/trip-list';
import { Login } from './pages/login/login';
import { isAnonymousGuard } from './guards/is-anonymous-guard';
import { Register } from './pages/register/register';
import { TripAdd } from './pages/trip-add/trip-add';
import { isAuthenticatedGuard } from './guards/is-authenticated-guard';

export const routes: Routes = [
  { path: 'login', component: Login, canActivate: [isAnonymousGuard] },
  { path: 'register', component: Register, canActivate: [isAnonymousGuard] },
  { path: 'trips', component: TripList },
  { path: 'trips/add', component: TripAdd, canActivate: [isAuthenticatedGuard] },
  { path: '**', redirectTo: 'trips' }
];
