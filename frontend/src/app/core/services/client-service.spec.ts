import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

import { ClientService } from './client-service';
import { Client } from '../models/client';
import { ClientRequest } from '../models/client-request';
import { environment } from '../../../environments/environment';

describe('ClientService', () => {
  let service: ClientService;
  let httpMock: HttpTestingController;

  const apiUrl = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    service = TestBed.inject(ClientService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should fetch my clients', () => {
    const mockClients: Client[] = [];

    service.getMyClients().subscribe((res: Client[]) => {
      expect(res).toEqual(mockClients);
    });

    const req = httpMock.expectOne(`${apiUrl}/clients`);
    expect(req.request.method).toBe('GET');

    req.flush(mockClients);
  });

  it('should create a client', () => {
    const clientRequest: ClientRequest = {
      companyName: 'ABC Ltd',
      industry: 'IT',
      address: 'Mumbai',
      annualTurnover: 10,
      documentsSubmitted: true,
      primaryContact: {
        name: 'John',
        email: 'john@test.com',
        phone: '9999999999'
      }
    };

    service.createClient(clientRequest).subscribe((res: Client) => {
      expect(res.companyName).toBe('ABC Ltd');
    });

    const req = httpMock.expectOne(`${apiUrl}/rm/clients`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(clientRequest);

    req.flush({ ...clientRequest, _id: '1' });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
