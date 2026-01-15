import { Routes } from '@angular/router';

export const ANALYST_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard').then(m => m.Dashboard)
  },
  {
    path: 'credit-requests',
    children: [
      {
        path: '',
        loadComponent: () => import('./credit-request-list/credit-request-list').then(m => m.CreditRequestList)
      },
      {
        path: ':id',  // ✅ FIXED - removed space before 'id'
        loadComponent:  () => import('./credit-request-details/credit-request-details').then(m => m.CreditRequestDetails)
      }
    ]
  }
];