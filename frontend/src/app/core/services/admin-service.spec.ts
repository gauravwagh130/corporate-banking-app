import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

import { AdminService } from './admin-service';
import { User } from '../models/user';
import { Client } from '../models/client';
import { UpdateUserStatusRequest } from '../models/update-user-status-request';
import { environment } from '../../../environments/environment';
describe('AdminService', () => {
  let service: AdminService;
  let httpMock: HttpTestingController;

  const apiUrl = `${environment.apiUrl}/admin`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    service = TestBed.inject(AdminService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  it('should fetch all users', () => {
    const mockUsers: User[] = [
      { id: '1', username: 'admin', email: 'admin@test.com', role: 'ADMIN', active: true }
    ] as User[];

    service.getAllUsers().subscribe((users: User[]) => {
      expect(users.length).toBe(1);
      expect(users[0].role).toBe('ADMIN');
    });

    const req = httpMock.expectOne(`${apiUrl}/users`);
    expect(req.request.method).toBe('GET');

    req.flush(mockUsers);
  });
  it('should update user status', () => {
    const userId = '1';
    const request: UpdateUserStatusRequest = {
      active: false
    };

    service.updateUserStatus(userId, request).subscribe((response: string) => {
      expect(response).toBe('User status updated');
    });

    const req = httpMock.expectOne(`${apiUrl}/users/${userId}/status`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(request);
    expect(req.request.responseType).toBe('text');

    req.flush('User status updated');
  });
  it('should fetch all clients', () => {
    const mockClients: Client[] = [];

    service.getAllClients().subscribe((clients: Client[]) => {
      expect(clients).toEqual(mockClients);
    });

    const req = httpMock.expectOne(`${apiUrl}/clients`);
    expect(req.request.method).toBe('GET');

    req.flush(mockClients);
  });
  afterEach(() => {
    httpMock.verify();
  });
});
