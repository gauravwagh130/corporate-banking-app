import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditRequestForm } from './credit-request-form';

describe('CreditRequestForm', () => {
  let component: CreditRequestForm;
  let fixture: ComponentFixture<CreditRequestForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreditRequestForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditRequestForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
