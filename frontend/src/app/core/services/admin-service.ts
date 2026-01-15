import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { Client } from '../models/client';
import { UpdateUserStatusRequest } from '../models/update-user-status-request';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private apiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }
  updateUserStatus(userId: string, request: UpdateUserStatusRequest): Observable<string> {
    return this.http.put(
      `${this.apiUrl}/users/${userId}/status`,
      request,
      { responseType: 'text' } 
    );
  }

  getAllClients(): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.apiUrl}/clients`);
  }
}
