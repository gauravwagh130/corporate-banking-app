import { TestBed } from '@angular/core/testing';
import { Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { roleGuard } from './role-guard';
import { AuthService } from '../services/auth-service';
import { BehaviorSubject, firstValueFrom, isObservable } from 'rxjs';

describe('roleGuard', () => {
  let router: jasmine.SpyObj<Router>;
  let currentUserSubject: BehaviorSubject<any>;

  beforeEach(() => {
    currentUserSubject = new BehaviorSubject<any>(null);
    router = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        {
          provide: AuthService,
          useValue: { currentUser$: currentUserSubject.asObservable() }
        },
        {
          provide: Router,
          useValue: router
        }
      ]
    });
  });

  async function runGuard(routeData: any, user: any) {
    currentUserSubject.next(user);

    const route = { data: routeData } as ActivatedRouteSnapshot;
    const state = { url: '/test' } as RouterStateSnapshot;

    const result = TestBed.runInInjectionContext(() =>
      roleGuard(route, state)
    );

    // 🔑 THIS IS THE FIX
    return isObservable(result) ? await firstValueFrom(result) : result;
  }

  it('should redirect to login if no user exists', async () => {
    const result = await runGuard({ role: 'ADMIN' }, null);

    expect(result).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should allow access when role matches', async () => {
    const result = await runGuard({ role: 'ADMIN' }, { role: 'ADMIN' });

    expect(result).toBe(true);
  });

  it('should redirect RM to RM dashboard when role mismatches', async () => {
    const result = await runGuard({ role: 'ADMIN' }, { role: 'RM' });

    expect(result).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/rm/dashboard']);
  });

  it('should allow access when no role is required', async () => {
    const result = await runGuard({}, { role: 'ANALYST' });

    expect(result).toBe(true);
  });
});
