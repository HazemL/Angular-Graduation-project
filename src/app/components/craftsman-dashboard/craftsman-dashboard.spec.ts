import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CraftsmanDashboard } from './craftsman-dashboard';

describe('CraftsmanDashboard', () => {
  let component: CraftsmanDashboard;
  let fixture: ComponentFixture<CraftsmanDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CraftsmanDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CraftsmanDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
