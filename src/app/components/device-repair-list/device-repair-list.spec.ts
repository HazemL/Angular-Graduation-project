import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceRepairList } from './device-repair-list';

describe('DeviceRepairList', () => {
  let component: DeviceRepairList;
  let fixture: ComponentFixture<DeviceRepairList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeviceRepairList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeviceRepairList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
