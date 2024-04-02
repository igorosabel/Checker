import { Routes } from '@angular/router';
import { isLoggedGuardFn } from '@app/guard/auth.guard.fn';
import LoginComponent from '@pages/login/login.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  {
    path: 'register',
    loadComponent: () => import('@pages/register/register.component'),
  },
  {
    path: 'forgot-pass',
    loadComponent: () => import('@pages/forgot-pass/forgot-pass.component'),
  },
  {
    path: 'home',
    loadComponent: () => import('@pages/main/main.component'),
    canActivate: [isLoggedGuardFn],
  },
];
