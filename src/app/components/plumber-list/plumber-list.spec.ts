import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlumberList } from './plumber-list';

describe('PlumberList', () => {
  let component: PlumberList;
  let fixture: ComponentFixture<PlumberList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlumberList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlumberList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
