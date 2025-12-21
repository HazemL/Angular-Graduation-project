import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarpenterList } from './carpenter-list';

describe('CarpenterList', () => {
  let component: CarpenterList;
  let fixture: ComponentFixture<CarpenterList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarpenterList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarpenterList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
