import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CreditRequestStatus } from '../../../core/models/credit-request-status';
import { CreditRequest } from '../../../core/models/credit-request';
import { AuthService } from '../../../core/services/auth-service';
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
  totalRequests = 0;
  pendingRequests = 0;
  approvedRequests = 0;
  rejectedRequests = 0;
  isLoading = false;

  constructor(
    private authService: AuthService,
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

    // Load all credit requests
    this.creditRequestService.getMyCreditRequests().subscribe({
      next: (requests: CreditRequest[]) => {
        this.totalRequests = requests.length;
        this.pendingRequests = requests.filter(
          (r) => r.status === CreditRequestStatus.PENDING
        ).length;
        this.approvedRequests = requests.filter(
          (r) => r.status === CreditRequestStatus.APPROVED
        ).length;
        this.rejectedRequests = requests.filter(
          (r) => r.status === CreditRequestStatus.REJECTED
        ).length;
        this.isLoading = false;
      },
      error: (error: Error) => {
        console.error('Error loading credit requests:', error);
        this.isLoading = false;
      },
    });
  }

  navigateToCreditRequests(): void {
    this.router.navigate(['/analyst/credit-requests']);
  }

  navigateToPendingRequests(): void {
    this.router.navigate(['/analyst/credit-requests'], { queryParams: { status: 'PENDING' } });
  }
  navigateToApprovedRequests(): void {
    this.router.navigate(['/analyst/credit-requests'], {
      queryParams: { status: CreditRequestStatus.APPROVED },
    });
  }
  navigateToRejectedRequest(): void{
    this.router.navigate(['/analyst/credit-requests'], {
      queryParams: { status: CreditRequestStatus.REJECTED },
    });
  }
  logout(): void {
    this.authService.logout();
  }
}
