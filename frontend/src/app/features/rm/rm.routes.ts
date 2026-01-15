import { Routes } from '@angular/router';

export const RM_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard').then((m) => m.Dashboard),
  },
  // Client Routes
  {
    path: 'clients',
    children: [
      {
        path: '',
        loadComponent: () => import('./client-list/client-list').then((m) => m.ClientList),
      },
      {
        path: 'add',
        loadComponent: () => import('./add-client/add-client').then((m) => m.AddClient),
      },
      {
        path: ':id/edit',  // ✅ Edit route
        loadComponent: () => import('./edit-client/edit-client').then((m) => m.EditClient),
      },
      {
        path: ':id',
        loadComponent: () => import('./client-details/client-details').then((m) => m.ClientDetails),
      },
    ],
  },
  // Credit Request Routes
  {
    path:  'credit-requests',
    children: [
      {
        path: '',
        loadComponent:  () =>
          import('./credit-request-list/credit-request-list').then((m) => m.CreditRequestList),
      },
      {
        path: 'new',
        loadComponent: () =>
          import('./credit-request-form/credit-request-form').then((m) => m.CreditRequestForm),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./credit-request-details/credit-request-details').then(
            (m) => m.CreditRequestDetails
          ),
      },
    ],
  },
];