import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AluminumTechnicianList } from './aluminum-technician-list';

describe('AluminumTechnicianList', () => {
  let component: AluminumTechnicianList;
  let fixture: ComponentFixture<AluminumTechnicianList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AluminumTechnicianList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AluminumTechnicianList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
