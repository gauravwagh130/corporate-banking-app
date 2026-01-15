import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth-service';
// import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl:  './unauthorized.html',
  styleUrl: './unauthorized.css'
})
export class Unauthorized {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  goToDashboard(): void {
    const role = this.authService.getUserRole();
    
    switch (role) {
      case 'ADMIN':
        this. router.navigate(['/admin/dashboard']);
        break;
      case 'RM':
        this. router.navigate(['/rm/dashboard']);
        break;
      case 'ANALYST': 
        this.router.navigate(['/analyst/dashboard']);
        break;
      default:
        this. router.navigate(['/login']);
    }
  }

  goBack(): void {
    window.history.back();
  }

  logout(): void {
    this.authService.logout();
  }
}