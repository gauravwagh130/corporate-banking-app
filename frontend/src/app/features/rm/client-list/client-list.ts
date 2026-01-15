import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { Client } from '../../../core/models/client';
import { ClientService } from '../../../core/services/client-service';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatChipsModule,
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

  // Filter properties
  searchName = '';
  selectedIndustry = '';
  showFilters = false;  // ✅ Toggle filter panel
  activeFilterCount = 0;  // ✅ Count active filters

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

  displayedColumns: string[] = ['companyName', 'industry', 'contact', 'turnover', 'documents', 'actions'];

  constructor(
    private clientService: ClientService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.isLoading = true;
    this.clientService.getMyClients().subscribe({
      next: (clients) => {
        this.clients = clients;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
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
      
      return matchesName && matchesIndustry;
    });

    this.updateActiveFilterCount();
  }

  updateActiveFilterCount(): void {
    this.activeFilterCount = 0;
    if (this.searchName) this.activeFilterCount++;
    if (this.selectedIndustry) this.activeFilterCount++;
  }

  clearFilters(): void {
    this.searchName = '';
    this.selectedIndustry = '';
    this.applyFilters();
  }

  toggleFilters(): void {
    this.showFilters = !this. showFilters;
  }

  viewClient(client: Client): void {
    this.router.navigate(['/rm/clients', client.id]);
  }

  addNewClient(): void {
    this.router.navigate(['/rm/clients/add']);
  }
}