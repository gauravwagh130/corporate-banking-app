import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';
import { ADMIN_ROUTES } from './features/admin/admin.routes';  // ✅ Import admin routes
import { RM_ROUTES } from './features/rm/rm.routes';
import { NotFound } from './shared/components/not-found/not-found';
import { Unauthorized } from './shared/components/unauthorized/unauthorized';
import { ANALYST_ROUTES } from './features/analyst/analyst.routes';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent:  () => import('./features/auth/login/login').then(m => m.Login)
  },
  
  // Admin Routes
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard],
    data: { role: 'ADMIN' },
    children:  ADMIN_ROUTES  // ✅ Use admin routes
  },

  // RM Routes
  {
    path: 'rm',
    canActivate: [authGuard, roleGuard],
    data:  { role:  'RM' },
    children: RM_ROUTES
  },

  // Analyst Routes
  {
    path: 'analyst',
    canActivate: [authGuard, roleGuard],
    data: { role: 'ANALYST' },
    children:   ANALYST_ROUTES
  },
  {
    path:   'unauthorized',
    component:  Unauthorized
  },
  {
    path: '404',
    component: NotFound
  },
  { path: '', redirectTo: '/login', pathMatch:  'full' },
  { path: '**', component: NotFound }
];