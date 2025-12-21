import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PainterList } from './painter-list';

describe('PainterList', () => {
  let component: PainterList;
  let fixture: ComponentFixture<PainterList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PainterList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PainterList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
