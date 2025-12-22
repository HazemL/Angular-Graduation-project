import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Dashreports } from './dashreports';

describe('Dashreports', () => {
  let component: Dashreports;
  let fixture: ComponentFixture<Dashreports>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dashreports]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Dashreports);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
