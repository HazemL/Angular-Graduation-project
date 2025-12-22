import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashCraftsman } from './dash-craftsman';

describe('DashCraftsman', () => {
  let component: DashCraftsman;
  let fixture: ComponentFixture<DashCraftsman>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashCraftsman]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashCraftsman);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
