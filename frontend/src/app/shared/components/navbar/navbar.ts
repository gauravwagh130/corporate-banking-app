import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { filter } from 'rxjs/operators';
import { AuthService } from '../../../core/services/auth-service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit {
  currentUser: any;
  showNavbar = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to user changes
    this.authService. currentUser$.subscribe(user => {
      this.currentUser = user;
      console.log('Navbar - Current user:', user);
    });

    // Hide navbar on login page
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.showNavbar = ! event.url.includes('/login');
    });
  }

  goToDashboard(): void {
    const role = this.currentUser?.role;
    
    switch (role) {
      case 'ADMIN':
        this.router. navigate(['/admin/dashboard']);
        break;
      case 'RM':
        this.router.navigate(['/rm/dashboard']);
        break;
      case 'ANALYST': 
        this.router.navigate(['/analyst/dashboard']);
        break;
      default:
        this.router. navigate(['/login']);
    }
  }

  logout(): void {
    this.authService.logout();
  }
}