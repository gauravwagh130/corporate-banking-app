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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ClientRequest } from '../../../core/models/client-request';
import { ClientService } from '../../../core/services/client-service';

@Component({
  selector: 'app-add-client',
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
  templateUrl: './add-client.html',
  styleUrl: './add-client.css'
})
export class AddClient implements OnInit {
  clientForm! : FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
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
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.clientForm = this.fb.group({
      companyName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      industry: ['', Validators.required],
      otherIndustry: [''],  // ✅ Add field for custom industry
      address: ['', [Validators.required, Validators.minLength(10)]],
      contactName: ['', [Validators.required, Validators.minLength(3)]],
      contactEmail: ['', [Validators.required, Validators.email]],
      contactPhone: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      annualTurnover: ['', [Validators.required, Validators.min(0.1)]],
      documentsSubmitted: [false]
    });

    // ✅ Watch for industry changes
    this.clientForm.get('industry')?.valueChanges.subscribe(value => {
      this.showOtherIndustry = value === 'Other';
      
      // Add/remove validator for otherIndustry
      if (this.showOtherIndustry) {
        this.clientForm.get('otherIndustry')?.setValidators([Validators.required, Validators.minLength(3)]);
      } else {
        this.clientForm.get('otherIndustry')?.clearValidators();
        this.clientForm.get('otherIndustry')?.setValue('');
      }
      this.clientForm.get('otherIndustry')?.updateValueAndValidity();
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

    // ✅ Use otherIndustry value if "Other" is selected
    const industryValue = this.showOtherIndustry 
      ? this.clientForm. value.otherIndustry. trim() 
      : this.clientForm.value.industry;

    const clientRequest: ClientRequest = {
      companyName:  this.clientForm.value.companyName. trim(),
      industry: industryValue,  // ✅ Use the determined industry value
      address: this.clientForm.value. address.trim(),
      primaryContact: {
        name: this.clientForm.value.contactName.trim(),
        email: this.clientForm.value.contactEmail.trim().toLowerCase(),
        phone: this. clientForm.value.contactPhone
      },
      annualTurnover: parseFloat(this.clientForm.value.annualTurnover),
      documentsSubmitted: this.clientForm.value.documentsSubmitted
    };

    this.clientService.createClient(clientRequest).subscribe({
      next: () => {
        this.successMessage = 'Client created successfully!';
        setTimeout(() => {
          this.router.navigate(['/rm/clients']);
        }, 1500);
      },
      error:  (error:  Error) => {
        this.errorMessage = error.message || 'Failed to create client';
        this.isLoading = false;
      }
    });
  }

  resetForm(): void {
    this.clientForm.reset({
      documentsSubmitted: false
    });
    this.showOtherIndustry = false;
    this.errorMessage = '';
    this.successMessage = '';
  }

  goBack(): void {
    this.router.navigate(['/rm/clients']);
  }
}