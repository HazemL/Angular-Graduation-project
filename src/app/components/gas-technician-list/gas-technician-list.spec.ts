import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GasTechnicianList } from './gas-technician-list';

describe('GasTechnicianList', () => {
  let component: GasTechnicianList;
  let fixture: ComponentFixture<GasTechnicianList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GasTechnicianList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GasTechnicianList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
