import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { CreditRequest } from '../../../core/models/credit-request';
import { CreditRequestStatus } from '../../../core/models/credit-request-status';
import { Client } from '../../../core/models/client';
import { CreditRequestService } from '../../../core/services/credit-request-service';
import { ClientService } from '../../../core/services/client-service';

@Component({
  selector:  'app-credit-request-details',
  standalone:  true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatDividerModule
  ],
  templateUrl: './credit-request-details.html',
  styleUrl: './credit-request-details.css'
})
export class CreditRequestDetails implements OnInit {
  creditRequest?: CreditRequest;
  client?: Client;
  isLoading = false;
  errorMessage = '';
  requestId! : string;

  CreditRequestStatus = CreditRequestStatus;

  constructor(
    private route:  ActivatedRoute,
    private router: Router,
    private creditRequestService: CreditRequestService,
    private clientService: ClientService
  ) {}

  ngOnInit(): void {
    this.requestId = this.route.snapshot.paramMap.get('id') || '';
    if (this. requestId) {
      this.loadRequestDetails();
    }
  }

  loadRequestDetails(): void {
    this.isLoading = true;
    this. creditRequestService.getCreditRequestById(this.requestId).subscribe({
      next: (request) => {
        this.creditRequest = request;
        this.loadClientDetails(request.clientId);
      },
      error: () => {
        this.errorMessage = 'Failed to load credit request details';
        this.isLoading = false;
      }
    });
  }

  loadClientDetails(clientId: string): void {
    this.clientService. getClientById(clientId).subscribe({
      next: (client) => {
        this.client = client;
        this.isLoading = false;
      },
      error: () => {
        // Client details failed but we have the request
        this.isLoading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/rm/credit-requests']);
  }

  getStatusColor(status: CreditRequestStatus): string {
    switch (status) {
      case CreditRequestStatus.APPROVED: 
        return 'primary';
      case CreditRequestStatus. REJECTED:
        return 'warn';
      default:
        return 'accent';
    }
  }

  getStatusIcon(status: CreditRequestStatus): string {
    switch (status) {
      case CreditRequestStatus. APPROVED:
        return 'check_circle';
      case CreditRequestStatus.REJECTED: 
        return 'cancel';
      default:
        return 'pending';
    }
  }
}