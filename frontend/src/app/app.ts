import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { Navbar } from './shared/components/navbar/navbar';
import { filter } from 'rxjs/operators';

@Component({
  selector:  'app-root',
  standalone: true,
  imports:  [
    CommonModule,
    RouterOutlet,
    Navbar
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  title = 'corporate-banking';
  showNavbar = true;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.showNavbar = !event.url. includes('/login') && 
                        !event.url.includes('/404') && 
                        !event.url.includes('/unauthorized');
    });
  }
}