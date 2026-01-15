import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

import { UserService } from './user-service';
import { CurrentUser } from '../models/current-user';
import { environment } from '../../../environments/environment';
describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  const apiUrl = `${environment.apiUrl}/users`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  it('should fetch current logged-in user', () => {
  const mockUser: CurrentUser = {
    id: '1',
    username: 'john',
    email: 'john@test.com',
    role: 'ADMIN',
    active: true
  };

  service.getCurrentUser().subscribe((user: CurrentUser) => {
    expect(user).toEqual(mockUser);
  });

  const req = httpMock.expectOne(`${apiUrl}/me`);
  expect(req.request.method).toBe('GET');

  req.flush(mockUser);
});

  afterEach(() => {
    httpMock.verify();
  });
});
