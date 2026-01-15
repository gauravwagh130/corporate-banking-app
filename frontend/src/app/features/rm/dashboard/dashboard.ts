import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CreditRequestStatus } from '../../../core/models/credit-request-status';
import { Client } from '../../../core/models/client';
import { CreditRequest } from '../../../core/models/credit-request';
import { AuthService } from '../../../core/services/auth-service';
import { ClientService } from '../../../core/services/client-service';
import { CreditRequestService } from '../../../core/services/credit-request-service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  currentUser: any;
  totalClients = 0;
  totalCreditRequests = 0;
  pendingRequests = 0;
  approvedRequests = 0;
  isLoading = false;

  constructor(
    private authService: AuthService,
    private clientService: ClientService,
    private creditRequestService: CreditRequestService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadStatistics();
  }

  private loadCurrentUser(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
  }

  private loadStatistics(): void {
    this.isLoading = true;

    // Load clients count
    this.clientService.getMyClients().subscribe({
      next: (clients: Client[]) => {
        this.totalClients = clients.length;
        this.checkLoadingComplete();
      },
      error: (error: Error) => {
        console.error('Error loading clients:', error);
        this.checkLoadingComplete();
      },
    });

    // Load credit requests count
    this.creditRequestService.getMyCreditRequests().subscribe({
      next: (requests: CreditRequest[]) => {
        this.totalCreditRequests = requests.length;
        this.pendingRequests = requests.filter(
          (r) => r.status === CreditRequestStatus.PENDING
        ).length;
        this.approvedRequests = requests.filter(
          (r) => r.status === CreditRequestStatus.APPROVED
        ).length;
        this.checkLoadingComplete();
      },
      error: (error: Error) => {
        console.error('Error loading credit requests:', error);
        this.checkLoadingComplete();
      },
    });
  }

  private checkLoadingComplete(): void {
    this.isLoading = false;
  }

  navigateToClients(): void {
    this.router.navigate(['/rm/clients']);
  }

  navigateToCreateClient(): void {
    this.router.navigate(['/rm/clients/add']);
  }

  navigateToCreditRequests(): void {
    this.router.navigate(['/rm/credit-requests']);
  }
  navigateToPendingCreditRequests(): void {
    this.router.navigate(['/rm/credit-requests'], {
      queryParams: { status: CreditRequestStatus.PENDING },
    });
  }
   navigateToApprovedCreditRequests(): void {
    this.router.navigate(['/rm/credit-requests'], {
      queryParams: { status: CreditRequestStatus.APPROVED },
    });
  }
  
  navigateToCreateCreditRequest(): void {
    this.router.navigate(['/rm/credit-requests/new']);
  }

  logout(): void {
    this.authService.logout();
  }
}
