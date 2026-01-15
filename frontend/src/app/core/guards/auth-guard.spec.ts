import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { authGuard } from './auth-guard';
import { AuthService } from '../services/auth-service';

class MockAuthService {
  isAuthenticated() {
    return false;
  }
}

class MockRouter {
  createUrlTree(commands: any[], extras?: any) {
    return { commands, extras };
  }
}

describe('authGuard', () => {
  let authService: AuthService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: Router, useClass: MockRouter }
      ]
    });

    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  it('should allow access when authenticated', () => {
    spyOn(authService, 'isAuthenticated').and.returnValue(true);

    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as any, { url: '/dashboard' } as any)
    );

    expect(result).toBe(true);
  });

  it('should redirect to login when not authenticated', () => {
    spyOn(authService, 'isAuthenticated').and.returnValue(false);

    const urlTree = router.createUrlTree(
      ['/login'],
      { queryParams: { returnUrl: '/dashboard' } }
    );
    spyOn(router, 'createUrlTree').and.returnValue(urlTree);

    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as any, { url: '/dashboard' } as any)
    );

    expect(result).toBe(urlTree);
  });
});
