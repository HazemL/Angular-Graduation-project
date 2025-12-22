import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobsCollection } from './jobs-collection';

describe('JobsCollection', () => {
  let component: JobsCollection;
  let fixture: ComponentFixture<JobsCollection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobsCollection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobsCollection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
