import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthSpentComponent } from './month-spent.component';

describe('MonthSpentComponent', () => {
  let component: MonthSpentComponent;
  let fixture: ComponentFixture<MonthSpentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthSpentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthSpentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
