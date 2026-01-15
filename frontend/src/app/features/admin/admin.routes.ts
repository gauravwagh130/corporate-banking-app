import { Routes } from '@angular/router';

export const ADMIN_ROUTES:  Routes = [
  {
    path: '',
    redirectTo:  'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent:  () => {
      console.log('🔄 Loading admin dashboard...');
      return import('./dashboard/dashboard').then(m => {
        return m.Dashboard;
      });
    }
  },
  {
    path: 'users',
    loadComponent:  () => {
      return import('./user-management/user-management').then(m => {
        return m.UserManagement;
      });
    }
  },
  {
    path: 'clients',
    loadComponent: () => {
      return import('./client-list/client-list').then(m => {
        return m.ClientList;
      }).catch(err => {
        throw err;
      });
    }
  }
];