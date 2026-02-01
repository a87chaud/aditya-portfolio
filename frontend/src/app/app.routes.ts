import { Routes } from '@angular/router';
import { authGuard } from './services/auth-guard.js';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home.component').then((i) => i.HomeComponent),
  },
  {
    path: 'admin/login',
    loadComponent: () => import('./admin-login/admin-login').then((i) => i.AdminLogin),
  },
  {
    path: 'admin/dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./admin-dashboard/admin-dashboard').then((m) => m.AdminDashboard),
  },
  {
    path: 'blog',
    loadComponent: () => import('./blog/blog').then((i) => i.Blog),
  },
  {
    path: 'blog/:id',
    loadComponent: () => import('./blog-post/blog-post').then((i) => i.BlogPostComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
