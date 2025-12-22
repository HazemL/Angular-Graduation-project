import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Dashprofile } from './dashprofile';

describe('Dashprofile', () => {
  let component: Dashprofile;
  let fixture: ComponentFixture<Dashprofile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dashprofile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Dashprofile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
