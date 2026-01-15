import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { CreditRequest } from '../../../core/models/credit-request';
import { CreditRequestStatus } from '../../../core/models/credit-request-status';
import { CreditRequestUpdate } from '../../../core/models/credit-request-update';
import { Client } from '../../../core/models/client';
import { CreditRequestService } from '../../../core/services/credit-request-service';
import { ClientService } from '../../../core/services/client-service';

@Component({
  selector: 'app-credit-request-details',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule
  ],
  templateUrl: './credit-request-details.html',
  styleUrl: './credit-request-details.css'
})
export class CreditRequestDetails implements OnInit {
  creditRequest?:  CreditRequest;
  client?: Client;
  reviewForm! : FormGroup;
  isLoading = false;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';
  requestId! : string;

  CreditRequestStatus = CreditRequestStatus;

  constructor(
    private route:  ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private creditRequestService: CreditRequestService,
    private clientService: ClientService
  ) {}

  ngOnInit(): void {
    this.requestId = this.route.snapshot. paramMap.get('id') || '';
    console.log('🆔 Request ID from route:', this.requestId);
    
    this.initializeForm();
    
    if (this.requestId) {
      this.loadRequestDetails();
    } else {
      console.error('❌ No request ID provided');
      this.errorMessage = 'Invalid request ID';
    }
  }

  initializeForm(): void {
    this.reviewForm = this.fb. group({
      status: ['', Validators.required],
      remarks: ['', [Validators.required, Validators.minLength(10)]]
    });
    console.log('📝 Review form initialized');
  }

  loadRequestDetails(): void {
    this.isLoading = true;
    console.log('🔍 Loading request details for ID:', this.requestId);
    
    this.creditRequestService.getCreditRequestById(this.requestId).subscribe({
      next: (request) => {
        console. log('✅ Request details loaded:', request);
        console.log('💰 Request amount:', request.requestAmount);
        console.log('📋 Request status:', request.status);
        console.log('👤 Client ID:', request.clientId);
        
        this.creditRequest = request;
        this.loadClientDetails(request.clientId);
        
        // Pre-fill form if already reviewed
        if (request.status !== CreditRequestStatus.PENDING) {
          console.log('📝 Pre-filling form - Request already reviewed');
          this.reviewForm.patchValue({
            status: request.status,
            remarks: request.remarks
          });
          this.reviewForm.disable();
        } else {
          console.log('✨ Request is PENDING - Form is enabled for review');
        }
      },
      error: (error) => {
        console.error('❌ Error loading request details:', error);
        console.error('❌ Error status:', error.status);
        console.error('❌ Error message:', error.message);
        this.errorMessage = 'Failed to load credit request details';
        this.isLoading = false;
      }
    });
  }

  loadClientDetails(clientId: string): void {
    console.log('🔍 Loading client details for ID:', clientId);
    
    this.clientService.getClientById(clientId).subscribe({
      next: (client) => {
        console.log('✅ Client details loaded:', client);
        this.client = client;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Error loading client details:', error);
        console.error('❌ Client error status:', error.status);
        // Client details failed but we have the request
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    console.log('🚀 Submit clicked');
    console.log('📝 Form valid:', this.reviewForm.valid);
    console.log('📝 Form value:', this.reviewForm.value);

    if (this.reviewForm.invalid) {
      this.reviewForm.markAllAsTouched();
      this.errorMessage = 'Please select a status and provide remarks';
      console.error('❌ Form is invalid');
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const update: CreditRequestUpdate = {
      status: this.reviewForm. value.status,
      remarks: this.reviewForm.value.remarks. trim()
    };

    console.log('📤 Submitting update:', update);
    console.log('🆔 Request ID:', this.requestId);

    this.creditRequestService.updateCreditRequest(this.requestId, update).subscribe({
      next: (response) => {
        console.log('✅ Update successful:', response);
        this.successMessage = 'Credit request updated successfully!';
        setTimeout(() => {
          this.router. navigate(['/analyst/credit-requests']);
        }, 1500);
      },
      error: (error:  any) => {
        console. error('❌ Update failed:', error);
        console.error('❌ Error status:', error.status);
        console.error('❌ Error body:', error.error);
        this.errorMessage = error?.error?.message || 'Failed to update credit request';
        this.isSubmitting = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/analyst/credit-requests']);
  }

  getStatusColor(status: CreditRequestStatus): string {
    switch (status) {
      case CreditRequestStatus.APPROVED: 
        return 'primary';
      case CreditRequestStatus.REJECTED: 
        return 'warn';
      default:
        return 'accent';
    }
  }

  getStatusIcon(status: CreditRequestStatus): string {
    switch (status) {
      case CreditRequestStatus.APPROVED: 
        return 'check_circle';
      case CreditRequestStatus.REJECTED:
        return 'cancel';
      default:
        return 'pending';
    }
  }

  isPending(): boolean {
    const pending = this.creditRequest?.status === CreditRequestStatus.PENDING;
    console.log('🔍 Is pending? ', pending, 'Status:', this.creditRequest?.status);
    return pending;
  }
}