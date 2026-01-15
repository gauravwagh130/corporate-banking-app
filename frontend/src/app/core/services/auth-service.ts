import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';
import { LoginRequest } from '../models/login-request';
import { LoginResponse } from '../models/login-response';
import { RegisterRequest } from '../models/register-request';
import { environment } from '../../../environments/environment';
import { StorageService } from './storage-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private storageService: StorageService
  ) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const user = this.storageService.getCurrentUser();
    if (user) {
      this.currentUserSubject.next(user);
    }
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, request).pipe(
      tap((response) => {
        console.log('Login response:', response); 
        this.storageService.setToken(response.jwtToken);
        this.storageService.setUserRole(response.role);
        const user = {
          username: request.email.split('@')[0],
          email: request.email,
          role: response.role,
        };
        this.storageService.setCurrentUser(user);

        this.currentUserSubject.next(user);

        console.log('Token stored:', this.storageService.getToken()); 
        console.log('Role stored:', this.storageService.getUserRole());
        console.log('User stored:', user); 
      })
    );
  }

  register(request: RegisterRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, request);
  }

  logout(): void {
    this.storageService.clear();
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    const token = this.storageService.getToken();
    return !!token;
  }

  getUserRole(): string | null {
    return this.storageService.getUserRole();
  }

  getCurrentUser(): any {
    return this.storageService.getCurrentUser();
  }
}
