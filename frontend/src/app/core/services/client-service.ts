import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client } from '../models/client';
import { ClientRequest } from '../models/client-request';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private rmApiUrl = `${environment.apiUrl}/rm/clients`;
  private clientApiUrl = `${environment.apiUrl}/clients`;

  constructor(private http: HttpClient) {
    console.log('🔧 ClientService initialized');
    console.log('📍 RM API URL:', this.rmApiUrl);
    console.log('📍 Client API URL:', this. clientApiUrl);
  }

  createClient(clientRequest: ClientRequest): Observable<Client> {
    console.log('📤 Creating client:', clientRequest);
    return this.http.post<Client>(this.rmApiUrl, clientRequest);
  }

  getMyClients(name?:  string, industry?: string): Observable<Client[]> {
    let params = new HttpParams();
    if (name) params = params.set('name', name);
    if (industry) params = params.set('industry', industry);
    
    console.log('📤 Fetching my clients with params:', params.toString());
    return this.http.get<Client[]>(this.clientApiUrl, { params });
  }

  getClientById(id:  string): Observable<Client> {
    const url = `${this.clientApiUrl}/${id}`;
    console.log('📤 Fetching client by ID:', id);
    console.log('📍 Full URL:', url);
    return this.http.get<Client>(url);
  }

  updateClient(id: string, clientRequest:  ClientRequest): Observable<Client> {
    console.log('📤 Updating client:', id, clientRequest);
    return this.http.put<Client>(`${this.clientApiUrl}/${id}`, clientRequest);
  }

  deleteClient(id: string): Observable<void> {
    console.log('📤 Deleting client:', id);
    return this.http.delete<void>(`${this.clientApiUrl}/${id}`);
  }
}