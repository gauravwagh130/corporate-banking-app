import { TestBed } from '@angular/core/testing';
import { StorageService } from './storage-service';
describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageService);
    localStorage.clear(); // 🔑 reset before each test
  });

  afterEach(() => {
    localStorage.clear(); // 🔑 cleanup after each test
  });
  it('should store and retrieve token', () => {
    service.setToken('test-token');

    const token = service.getToken();
    expect(token).toBe('test-token');
  });
  it('should store and retrieve current user', () => {
    const user = { username: 'john', role: 'ADMIN' };

    service.setCurrentUser(user);
    const storedUser = service.getCurrentUser();

    expect(storedUser).toEqual(user);
  });
  it('should store and retrieve user role', () => {
    service.setUserRole('RM');

    const role = service.getUserRole();
    expect(role).toBe('RM');
  });
  it('should clear all stored values', () => {
    service.setToken('token');
    service.setCurrentUser({ username: 'admin' });
    service.setUserRole('ADMIN');

    service.clear();

    expect(service.getToken()).toBeNull();
    expect(service.getCurrentUser()).toBeNull();
    expect(service.getUserRole()).toBeNull();
  });
});
