import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcTechnicianList } from './ac-technician-list';

describe('AcTechnicianList', () => {
  let component: AcTechnicianList;
  let fixture: ComponentFixture<AcTechnicianList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcTechnicianList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcTechnicianList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
