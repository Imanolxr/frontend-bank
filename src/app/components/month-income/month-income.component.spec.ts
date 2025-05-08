import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthIncomeComponent } from './month-income.component';

describe('MonthIncomeComponent', () => {
  let component: MonthIncomeComponent;
  let fixture: ComponentFixture<MonthIncomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthIncomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthIncomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
