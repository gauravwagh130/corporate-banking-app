import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreditRequestList } from './credit-request-list';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

// Mocks for services and data models
import { CreditRequestService } from '../../../core/services/credit-request-service'; // <-- make sure this path is correct!
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

class MockCreditRequestService {
  getMyCreditRequests() {
    return of([
      { clientId: 'c1', status: 'PENDING', purpose: 'Bridge Loan' },
      { clientId: 'c2', status: 'APPROVED', purpose: 'Expansion' },
    ]);
  }
}

describe('CreditRequestList', () => {
  let component: CreditRequestList;
  let fixture: ComponentFixture<CreditRequestList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CreditRequestList, // Standalone
        FormsModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatChipsModule,
        MatProgressSpinnerModule,
        MatTableModule,
        MatTooltipModule,
      ],
      providers: [
        {
          provide: ActivatedRoute,
        useValue: {
          params: of({ id: 'test-id' }),   // if your component needs route params
          queryParams: of({}),              // provide if using queryParams in this component
          snapshot: {},
          },
        },
        {
          provide: CreditRequestService,  // 🔥 THIS LINE IS CRITICAL!
          useClass: MockCreditRequestService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreditRequestList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load requests and show them', () => {
    expect(component.filteredRequests.length).toBe(2);
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Bridge Loan');
    expect(compiled.textContent).toContain('Expansion');
  });

  it('should filter by search', () => {
    component.searchTerm = 'bridge';
    component.applyFilters();
    expect(component.filteredRequests.length).toBe(1);
    expect(component.filteredRequests[0].purpose).toBe('Bridge Loan');
  });

  it('should filter by status', () => {
    component.selectedStatus = 'APPROVED';
    component.applyFilters();
    expect(component.filteredRequests.length).toBe(1);
    expect(component.filteredRequests[0].status).toBe('APPROVED');
  });

  it('should clear filters', () => {
    component.searchTerm = 'foo';
    component.selectedStatus = 'PENDING';
    component.clearFilters();
    expect(component.searchTerm).toBe('');
    expect(component.selectedStatus).toBe('');
  });
}); 