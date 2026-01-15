import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CreditRequest } from '../../../core/models/credit-request';
import { CreditRequestStatus } from '../../../core/models/credit-request-status';
import { CreditRequestService } from '../../../core/services/credit-request-service';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatBadgeModule } from '@angular/material/badge';

@Component({
  selector: 'app-credit-request-list',
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
    MatChipsModule,
    MatBadgeModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './credit-request-list.html',
  styleUrl: './credit-request-list.css',
})
export class CreditRequestList implements OnInit {
  creditRequests: CreditRequest[] = [];
  filteredRequests: CreditRequest[] = [];

  searchTerm = '';
  selectedStatus = '';
  showFilters = false;
  activeFilterCount = 0;

  isLoading = false;
  errorMessage = '';

  statuses = ['PENDING', 'APPROVED', 'REJECTED'];

  displayedColumns: string[] = [
    'clientId',
    'purpose',
    'amount',
    'tenure',
    'createdAt',
    'status',
    'actions',
  ];

  constructor(
    private creditRequestService: CreditRequestService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {

  // Load data once
  this.loadRequests();

  // React to dashboard navigation (?status=PENDING)
  this.route.queryParams.subscribe(params => {
    if (params['status']) {
      this.selectedStatus = params['status'];
    } else {
      this.selectedStatus = '';
    }

    // Apply filter again when param changes
    this.applyFilters();
  });
}


  loadRequests(): void {
    this.isLoading = true;
    this.creditRequestService.getMyCreditRequests().subscribe({
      next: (data) => {
        this.creditRequests = data;
        this.applyFilters();
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load credit requests';
        this.isLoading = false;
      },
    });
  }

  applyFilters(): void {
    this.filteredRequests = this.creditRequests.filter((r) => {
      const matchSearch =
        !this.searchTerm ||
        r.clientId.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        r.purpose?.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchStatus = !this.selectedStatus || r.status === this.selectedStatus;

      return matchSearch && matchStatus;
    });

    this.updateActiveFilterCount();
  }

  updateActiveFilterCount(): void {
    this.activeFilterCount = 0;
    if (this.searchTerm) this.activeFilterCount++;
    if (this.selectedStatus) this.activeFilterCount++;
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedStatus = '';
    this.applyFilters();
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  viewRequest(id: string): void {
    this.router.navigate(['/analyst/credit-requests', id]);
  }
}
