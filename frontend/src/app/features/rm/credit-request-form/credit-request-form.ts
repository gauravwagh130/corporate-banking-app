import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CreditRequestRequest } from '../../../core/models/credit-request-request';
import { Client } from '../../../core/models/client';
import { CreditRequestService } from '../../../core/services/credit-request-service';
import { ClientService } from '../../../core/services/client-service';

@Component({
  selector: 'app-credit-request-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './credit-request-form.html',
  styleUrl: './credit-request-form.css'
})
export class CreditRequestForm implements OnInit {
  requestForm! : FormGroup;
  clients: Client[] = [];
  isLoading = false;
  isLoadingClients = false;
  errorMessage = '';
  successMessage = '';

  tenureOptions = [6, 12, 18, 24, 36, 48, 60];
  purposeOptions = [
    'Working capital requirement',
    'Business expansion',
    'Equipment purchase',
    'Inventory funding',
    'Project financing',
    'Debt refinancing',
    'Other'
  ];

  constructor(
    private fb: FormBuilder,
    private creditRequestService: CreditRequestService,
    private clientService: ClientService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadClients();
  }

  private initializeForm(): void {
    this.requestForm = this. fb.group({
      clientId: ['', Validators.required],
      requestAmount: ['', [Validators.required, Validators. min(0.1)]],
      tenureMonths:  ['', [Validators.required, Validators.min(1)]],
      purpose: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  private loadClients(): void {
    this.isLoadingClients = true;
    this. clientService.getMyClients().subscribe({
      next: (clients) => {
        this.clients = clients. filter(c => c. documentsSubmitted);
        this.isLoadingClients = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load clients';
        this.isLoadingClients = false;
      }
    });
  }

  onSubmit(): void {
  if (this.requestForm. invalid) {
    this.requestForm.markAllAsTouched();
    this.errorMessage = 'Please fill all required fields correctly';
    return;
  }

  this.isLoading = true;
  this.errorMessage = '';
  this.successMessage = '';

  // ✅ Convert crores to rupees (multiply by 10,000,000)
  const amountInCrores = parseFloat(this. requestForm.value.requestAmount);
  const amountInRupees = Math.round(amountInCrores * 10000000);

  const request:  CreditRequestRequest = {
    clientId: this.requestForm. value.clientId,
    requestAmount: amountInRupees,  // ✅ Send in rupees
    tenureMonths: parseInt(this.requestForm. value.tenureMonths),
    purpose: this.requestForm. value.purpose. trim()
  };

  console.log('📤 Amount in crores:', amountInCrores);
  console.log('📤 Amount in rupees:', amountInRupees);
  console.log('📤 Submitting credit request:', request);

  this.creditRequestService.createCreditRequest(request).subscribe({
    next: () => {
      this.successMessage = 'Credit request submitted successfully! ';
      setTimeout(() => {
        this.router.navigate(['/rm/credit-requests']);
      }, 1500);
    },
    error: (error: any) => {
      this.errorMessage = error?. error?.message || 'Failed to submit credit request';
      this.isLoading = false;
    }
  });
}

  resetForm(): void {
    this.requestForm.reset();
    this.errorMessage = '';
    this.successMessage = '';
  }

  goBack(): void {
    this.router.navigate(['/rm/credit-requests']);
  }

  getClientName(clientId: string): string {
    const client = this. clients.find(c => c. id === clientId);
    return client ? client.companyName :  '';
  }
}