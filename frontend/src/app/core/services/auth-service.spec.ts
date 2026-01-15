import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';

import { AuthService } from './auth-service';
import { StorageService } from './storage-service';
import { LoginRequest } from '../models/login-request';
import { LoginResponse } from '../models/login-response';
import { RegisterRequest } from '../models/register-request';
import { environment } from '../../../environments/environment';
import { Role } from '../models/role';
class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

class MockStorageService {
  private store: any = {};

  setToken(token: string) {
    this.store.token = token;
  }

  getToken() {
    return this.store.token || null;
  }

  setUserRole(role: string) {
    this.store.role = role;
  }

  getUserRole() {
    return this.store.role || null;
  }

  setCurrentUser(user: any) {
    this.store.user = user;
  }

  getCurrentUser() {
    return this.store.user || null;
  }

  clear() {
    this.store = {};
  }
}
describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let router: Router;
  let storage: StorageService;

  const apiUrl = `${environment.apiUrl}/auth`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: Router, useClass: MockRouter },
        { provide: StorageService, useClass: MockStorageService },
      ],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    storage = TestBed.inject(StorageService);
  });
  it('should login and store user details', () => {
    const request: LoginRequest = {
      email: 'john@test.com',
      password: '123456',
    };

    const response: LoginResponse = {
      jwtToken: 'fake-jwt-token',
      role: 'ADMIN',
    };

    service.login(request).subscribe((res) => {
      expect(res).toEqual(response);
    });

    const req = httpMock.expectOne(`${apiUrl}/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(request);

    req.flush(response);

    expect(storage.getToken()).toBe('fake-jwt-token');
    expect(storage.getUserRole()).toBe('ADMIN');
    expect(storage.getCurrentUser().email).toBe('john@test.com');
  });
  it('should register a user', () => {
    const request: RegisterRequest = {
      username: 'john',
      email: 'john@test.com',
      password: '123456',
      role: Role.RM,
    };

    service.register(request).subscribe((res) => {
      expect(res).toBeTruthy();
    });

    const req = httpMock.expectOne(`${apiUrl}/register`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(request);

    req.flush({ success: true });
  });
  it('should logout user and navigate to login', () => {
    service.logout();

    expect(storage.getToken()).toBeNull();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
  it('should return true when token exists', () => {
    storage.setToken('token');
    expect(service.isAuthenticated()).toBeTrue();
  });

  it('should return false when token does not exist', () => {
    storage.clear();
    expect(service.isAuthenticated()).toBeFalse();
  });
  afterEach(() => {
    httpMock.verify();
  });
});
