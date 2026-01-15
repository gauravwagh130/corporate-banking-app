import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CreditRequest } from '../models/credit-request';
import { CreditRequestRequest } from '../models/credit-request-request';
import { CreditRequestUpdate } from '../models/credit-request-update';
import { CreditRequestStatus } from '../models/credit-request-status';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CreditRequestService {
  private apiUrl = `${environment.apiUrl}/credit-requests`;

  constructor(private http: HttpClient) {}

  getMyCreditRequests(status?: CreditRequestStatus): Observable<CreditRequest[]> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);

    console.log('🌐 API Call:  GET', this.apiUrl, params);
    return this.http
      .get<CreditRequest[]>(this.apiUrl, { params })
      .pipe(tap((response) => console.log('📥 GET credit requests response:', response)));
  }

  /**
   * Get credit request by ID
   * GET /api/credit-requests/{id}
   */
  getCreditRequestById(id: string): Observable<CreditRequest> {
    const url = `${this.apiUrl}/${id}`;
    console.log('🌐 API Call: GET', url);
    return this.http
      .get<CreditRequest>(url)
      .pipe(tap((response) => console.log('📥 GET credit request by ID response:', response)));
  }

  /**
   * Create credit request (RM only)
   * POST /api/credit-requests
   */
  createCreditRequest(request: CreditRequestRequest): Observable<CreditRequest> {
    console.log('🌐 API Call:  POST', this.apiUrl, request);
    return this.http
      .post<CreditRequest>(this.apiUrl, request)
      .pipe(tap((response) => console.log('📥 POST credit request response:', response)));
  }

  /**
   * Update credit request (Analyst updates status & remarks)
   * PUT /api/credit-requests/{id}
   */
  updateCreditRequest(id: string, update: CreditRequestUpdate): Observable<CreditRequest> {
    const url = `${this.apiUrl}/${id}`;
    console.log('🌐 API Call:  PUT', url);
    console.log('📤 Update payload:', update);
    return this.http
      .put<CreditRequest>(url, update)
      .pipe(tap((response) => console.log('📥 PUT credit request response:', response)));
  }
}
