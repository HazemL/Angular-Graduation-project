import { TestBed } from '@angular/core/testing';

import { CraftsProfileService } from './crafts-profile-service';

describe('CraftsProfileService', () => {
  let service: CraftsProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CraftsProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
