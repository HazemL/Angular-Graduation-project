import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectricianList } from './electrician-list';

describe('ElectricianList', () => {
  let component: ElectricianList;
  let fixture: ComponentFixture<ElectricianList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ElectricianList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ElectricianList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
