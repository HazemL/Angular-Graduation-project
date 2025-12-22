import { TestBed } from '@angular/core/testing';

import { Craftsjobs } from './craftsjobs';

describe('Craftsjobs', () => {
  let service: Craftsjobs;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Craftsjobs);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
