import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { Client } from '../../../core/models/client';
import { ClientService } from '../../../core/services/client-service';


@Component({
  selector: 'app-client-details',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatChipsModule
  ],
  templateUrl: './client-details.html',
  styleUrl: './client-details.css'
})
export class ClientDetails implements OnInit {
  client?:  Client;
  isLoading = true;  // ✅ Start with true
  errorMessage = '';
  clientId = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clientService: ClientService
  ) {
    console.log('🏗️ ClientDetails component constructed');
  }

  ngOnInit(): void {
    console.log('🚀 ClientDetails ngOnInit');
    
    // Get ID from route
    this.clientId = this. route.snapshot.paramMap.get('id') || '';

    
    if (this.clientId) {
      this.loadClientDetails();
    } else {
      this.errorMessage = 'No client ID provided in URL';
      this.isLoading = false;
  
    }
  }

  loadClientDetails(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.clientService. getClientById(this.clientId).subscribe({
      next: (client:  Client) => {
      
        this. client = client;
        this. isLoading = false;
      },
      error: (error:  any) => {
       
        this.errorMessage = this.getErrorMessage(error);
        this.isLoading = false;
      },
      complete: () => {
        console.log('🏁 Client details loading completed');
      }
    });
  }

  private getErrorMessage(error: any): string {
    if (error.status === 404) {
      return 'Client not found';
    } else if (error.status === 403) {
      return 'Access denied - You do not have permission to view this client';
    } else if (error.status === 0) {
      return 'Cannot connect to server - Please check if backend is running';
    } else if (error.error?.message) {
      return error.error.message;
    } else {
      return 'Failed to load client details';
    }
  }

  goBack(): void {
    this.router.navigate(['/rm/clients']);
  }

  editClient(): void {
  this.router.navigate(['/rm/clients', this.clientId, 'edit']);  // ✅ Navigate to edit page
}
}