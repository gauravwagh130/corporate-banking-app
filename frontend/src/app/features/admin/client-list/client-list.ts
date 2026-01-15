import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { Client } from '../../../core/models/client';
import { AdminService } from '../../../core/services/admin-service';


@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatBadgeModule
  ],
  templateUrl: './client-list.html',
  styleUrl: './client-list.css'
})
export class ClientList implements OnInit {
  clients: Client[] = [];
  filteredClients: Client[] = [];
  isLoading = false;
  errorMessage = '';
  showFilters = false;
  activeFilterCount = 0;


  searchName = '';
  selectedIndustry = '';
  selectedDocStatus = '';

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

  displayedColumns: string[] = ['companyName', 'industry', 'contact', 'turnover', 'documents', 'rm'];

  constructor(
    private adminService: AdminService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.isLoading = true;
    this. errorMessage = '';
    
    this.adminService. getAllClients().subscribe({
      next: (clients: Client[]) => {
        this.clients = clients;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error:  Error) => {
        console. error('Error loading clients:', error);
        this.errorMessage = 'Failed to load clients';
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    this.filteredClients = this.clients.filter(client => {
      const matchesName = !this.searchName || 
        client.companyName. toLowerCase().includes(this.searchName.toLowerCase());
      
      const matchesIndustry = !this.selectedIndustry || 
        client.industry === this.selectedIndustry;
      
      const matchesDocStatus = !this.selectedDocStatus ||
        (this.selectedDocStatus === 'submitted' && client.documentsSubmitted) ||
        (this.selectedDocStatus === 'pending' && ! client.documentsSubmitted);
      
      return matchesName && matchesIndustry && matchesDocStatus;
    });

    this.updateActiveFilterCount();
  }

  updateActiveFilterCount(): void {
    this.activeFilterCount = 0;
    if (this.searchName) this.activeFilterCount++;
    if (this.selectedIndustry) this.activeFilterCount++;
    if (this.selectedDocStatus) this.activeFilterCount++;
  }

  clearFilters(): void {
    this.searchName = '';
    this.selectedIndustry = '';
    this.selectedDocStatus = '';
    this.applyFilters();
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  goBack(): void {
    this.router.navigate(['/admin/dashboard']);
  }

  formatCurrency(amount: number): string {
    return `₹${amount.toFixed(1)} Cr`;
  }
}