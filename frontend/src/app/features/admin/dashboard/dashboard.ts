import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { User } from '../../../core/models/user';
import { Client } from '../../../core/models/client';
import { forkJoin, Subject, interval } from 'rxjs';
import { takeUntil, startWith, switchMap } from 'rxjs/operators';
import { AuthService } from '../../../core/services/auth-service';
import { AdminService } from '../../../core/services/admin-service';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  totalClients: number;
  clientsWithDocuments: number;
  clientsWithoutDocuments: number;
  adminCount: number;
  rmCount: number;
  analystCount: number;
}

@Component({
  selector:  'app-dashboard',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatBadgeModule
  ],
  templateUrl:  './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit, OnDestroy {
  currentUser: any;
  stats: DashboardStats = {
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    totalClients: 0,
    clientsWithDocuments: 0,
    clientsWithoutDocuments: 0,
    adminCount: 0,
    rmCount: 0,
    analystCount: 0
  };
  
  isLoading = true;
  loadingError = false;
  lastRefreshed:  Date | null = null;
  autoRefreshEnabled = false;
  
  private destroy$ = new Subject<void>();
  private refreshInterval = 60000; // 60 seconds

  constructor(
    private authService: AuthService,
    private adminService: AdminService,
    private router: Router,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadDashboardData();
  }

  ngOnDestroy(): void {
    this.destroy$. next();
    this.destroy$. complete();
  }

  private loadCurrentUser(): void {
    this.authService.currentUser$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(user => {
      this.currentUser = user;
      
      if (user && user.role !== 'ADMIN') {
        this.snackBar.open('Access Denied:  Admin privileges required', 'Close', {
          duration: 5000,
          panelClass:  ['error-snackbar']
        });
        this.logout();
      }
    });
  }

  private loadDashboardData(): void {
    this.isLoading = true;
    this.loadingError = false;

    forkJoin({
      users:  this.adminService.getAllUsers(),
      clients: this. adminService.getAllClients()
    }).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (result) => {
        this.calculateStats(result.users, result. clients);
        this.isLoading = false;
        this.lastRefreshed = new Date();
        this.cdr.detectChanges();
      },
      error: (error:  Error) => {
        console.error('Error loading dashboard data:', error);
        this.loadingError = true;
        this.isLoading = false;
        this.showErrorSnackbar();
        this.cdr.detectChanges();
      }
    });
  }

  private calculateStats(users: User[], clients: Client[]): void {
    this.stats.totalUsers = users.length;
    this.stats.activeUsers = users.filter(u => u.active).length;
    this.stats.inactiveUsers = users. filter(u => !u.active).length;
    this.stats.adminCount = users.filter(u => u.role === 'ADMIN').length;
    this.stats.rmCount = users.filter(u => u.role === 'RM').length;
    this.stats.analystCount = users.filter(u => u. role === 'ANALYST').length;

  
    this.stats.totalClients = clients.length;
    this. stats.clientsWithDocuments = clients.filter(c => c. documentsSubmitted).length;
    this.stats. clientsWithoutDocuments = clients.filter(c => !c. documentsSubmitted).length;
  }

  private showErrorSnackbar(): void {
    const snackBarRef = this.snackBar. open(
      'Failed to load dashboard data',
      'Retry',
      {
        duration: 0,
        panelClass: ['error-snackbar']
      }
    );

    snackBarRef.onAction().subscribe(() => {
      this.loadDashboardData();
    });
  }

  refreshData(): void {
    this.snackBar.open('Refreshing dashboard...', '', { duration: 1000 });
    this.loadDashboardData();
  }

  toggleAutoRefresh(): void {
    this.autoRefreshEnabled = !this.autoRefreshEnabled;

    if (this.autoRefreshEnabled) {
      interval(this.refreshInterval).pipe(
        startWith(0),
        switchMap(() => forkJoin({
          users:  this.adminService.getAllUsers(),
          clients: this.adminService.getAllClients()
        })),
        takeUntil(this.destroy$)
      ).subscribe({
        next: (result) => {
          this.calculateStats(result.users, result.clients);
          this.lastRefreshed = new Date();
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Auto-refresh error:', error);
          this.autoRefreshEnabled = false;
        }
      });

      this.snackBar.open('Auto-refresh enabled', 'Dismiss', { duration: 2000 });
    } else {
      this.destroy$.next();
      this.snackBar.open('Auto-refresh disabled', 'Dismiss', { duration: 2000 });
    }
  }

  retryLoad(): void {
    this.loadDashboardData();
  }

  navigateToUsers(): void {
    this.router.navigate(['/admin/users']);
  }

  navigateToClients(): void {
    this.router.navigate(['/admin/clients']);
  }

  logout(): void {
    this.authService.logout();
  }

  getActiveUsersPercentage(): number {
    return this.stats.totalUsers > 0 
      ? Math.round((this.stats.activeUsers / this.stats.totalUsers) * 100) 
      : 0;
  }

  getDocumentCompletionPercentage(): number {
    return this.stats.totalClients > 0 
      ? Math.round((this.stats.clientsWithDocuments / this.stats.totalClients) * 100) 
      : 0;
  }

  getTimeSinceRefresh(): string {
    if (!this.lastRefreshed) return 'Never';
    
    const seconds = Math.floor((new Date().getTime() - this.lastRefreshed.getTime()) / 1000);
    
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  }
}