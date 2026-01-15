import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

import { CreditRequestService } from './credit-request-service';
import { CreditRequest } from '../models/credit-request';
import { CreditRequestRequest } from '../models/credit-request-request';
import { CreditRequestUpdate } from '../models/credit-request-update';
import { CreditRequestStatus } from '../models/credit-request-status';
import { environment } from '../../../environments/environment';
describe('CreditRequestService', () => {
  let service: CreditRequestService;
  let httpMock: HttpTestingController;

  const apiUrl = `${environment.apiUrl}/credit-requests`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    service = TestBed.inject(CreditRequestService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  it('should fetch my credit requests', () => {
    const mockRequests: CreditRequest[] = [];

    service.getMyCreditRequests().subscribe((res: CreditRequest[]) => {
      expect(res).toEqual(mockRequests);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');

    req.flush(mockRequests);
  });
  it('should fetch credit requests by status', () => {
    const mockRequests: CreditRequest[] = [];
    const status = CreditRequestStatus.PENDING;

    service.getMyCreditRequests(status).subscribe((res: CreditRequest[]) => {
      expect(res).toEqual(mockRequests);
    });

    const req = httpMock.expectOne(
      r => r.url === apiUrl && r.params.get('status') === status
    );

    expect(req.request.method).toBe('GET');
    req.flush(mockRequests);
  });
  it('should fetch credit request by id', () => {
    const mockRequest = { id: '1' } as CreditRequest;

    service.getCreditRequestById('1').subscribe((res: CreditRequest) => {
      expect(res.id).toBe('1');
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');

    req.flush(mockRequest);
  });
  it('should create credit request', () => {
    const request: CreditRequestRequest = {
      clientId: '1',
      requestAmount: 500000,
      tenureMonths: 12,
      purpose: 'Working capital'
    };

    service.createCreditRequest(request).subscribe((res: CreditRequest) => {
      expect(res.requestAmount).toBe(500000);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(request);

    req.flush({ ...request, id: '10' });
  });
  it('should update credit request', () => {
    const update: CreditRequestUpdate = {
      status: CreditRequestStatus.APPROVED,
      remarks: 'Approved'
    };

    service.updateCreditRequest('10', update).subscribe((res: CreditRequest) => {
      expect(res.status).toBe(CreditRequestStatus.APPROVED);
    });

    const req = httpMock.expectOne(`${apiUrl}/10`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(update);

    req.flush({ id: '10', ...update });
  });
  afterEach(() => {
    httpMock.verify();
  });
});
