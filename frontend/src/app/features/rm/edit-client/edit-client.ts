import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ClientRequest } from '../../../core/models/client-request';
import { Client } from '../../../core/models/client';
import { ClientService } from '../../../core/services/client-service';


@Component({
  selector: 'app-edit-client',
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
    MatCheckboxModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './edit-client.html',
  styleUrl: './edit-client.css'
})
export class EditClient implements OnInit {
  clientForm! : FormGroup;
  isLoading = false;
  isLoadingClient = true;
  errorMessage = '';
  successMessage = '';
  clientId = '';
  showOtherIndustry = false;

  industries = [
    'Technology',
    'Manufacturing',
    'Retail',
    'Finance',
    'Healthcare',
    'Agriculture',
    'Construction',
    'Education',
    'Hospitality',
    'Real Estate',
    'Other'
  ];

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.clientId = this.route.snapshot.paramMap.get('id') || '';
    this.initializeForm();
    
    if (this.clientId) {
      this.loadClient();
    } else {
      this.errorMessage = 'No client ID provided';
      this.isLoadingClient = false;
    }
  }

  private initializeForm(): void {
    this.clientForm = this.fb. group({
      companyName: ['', [Validators.required, Validators. minLength(3), Validators.maxLength(100)]],
      industry: ['', Validators.required],
      otherIndustry: [''],
      address: ['', [Validators.required, Validators. minLength(10)]],
      contactName: ['', [Validators. required, Validators.minLength(3)]],
      contactEmail: ['', [Validators.required, Validators.email]],
      contactPhone: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      annualTurnover: ['', [Validators.required, Validators.min(0.1)]],
      documentsSubmitted: [false]
    });

    // Watch for industry changes
    this.clientForm. get('industry')?.valueChanges.subscribe(value => {
      this.showOtherIndustry = value === 'Other';
      
      if (this.showOtherIndustry) {
        this.clientForm.get('otherIndustry')?.setValidators([Validators.required, Validators.minLength(3)]);
      } else {
        this.clientForm.get('otherIndustry')?.clearValidators();
        this.clientForm.get('otherIndustry')?.setValue('');
      }
      this.clientForm.get('otherIndustry')?.updateValueAndValidity();
    });
  }

  private loadClient(): void {
    this.isLoadingClient = true;
    this. clientService.getClientById(this.clientId).subscribe({
      next: (client:  Client) => {
        this.populateForm(client);
        this.isLoadingClient = false;
      },
      error: (error:  any) => {
        this.errorMessage = 'Failed to load client details';
        this.isLoadingClient = false;
      }
    });
  }

  private populateForm(client: Client): void {
    // Check if industry is in predefined list
    const isCustomIndustry = ! this.industries.includes(client. industry);
    
    this.clientForm.patchValue({
      companyName: client. companyName,
      industry:  isCustomIndustry ? 'Other' : client.industry,
      otherIndustry:  isCustomIndustry ? client. industry : '',
      address: client.address,
      contactName: client.primaryContact.name,
      contactEmail: client.primaryContact.email,
      contactPhone: client.primaryContact.phone,
      annualTurnover: client.annualTurnover,
      documentsSubmitted: client.documentsSubmitted
    });
  }

  onSubmit(): void {
    if (this.clientForm.invalid) {
      this.clientForm.markAllAsTouched();
      this.errorMessage = 'Please fill all required fields correctly';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const industryValue = this.showOtherIndustry 
      ? this.clientForm. value.otherIndustry. trim() 
      : this.clientForm.value.industry;

    const clientRequest: ClientRequest = {
      companyName: this.clientForm. value.companyName. trim(),
      industry: industryValue,
      address: this.clientForm.value. address.trim(),
      primaryContact: {
        name: this.clientForm.value.contactName.trim(),
        email: this.clientForm.value.contactEmail.trim().toLowerCase(),
        phone: this. clientForm.value.contactPhone
      },
      annualTurnover: parseFloat(this.clientForm.value.annualTurnover),
      documentsSubmitted: this. clientForm.value.documentsSubmitted
    };

    this. clientService.updateClient(this. clientId, clientRequest).subscribe({
      next: () => {
        this.successMessage = 'Client updated successfully!';
        setTimeout(() => {
          this.router.navigate(['/rm/clients', this.clientId]);
        }, 1500);
      },
      error: (error: Error) => {
        this.errorMessage = error.message || 'Failed to update client';
        this.isLoading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/rm/clients', this.clientId]);
  }
}