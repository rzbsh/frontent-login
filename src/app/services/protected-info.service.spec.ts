import { TestBed } from '@angular/core/testing';

import { ProtectedInfoService } from './protected-info.service';

describe('ProtectedInfoService', () => {
  let service: ProtectedInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProtectedInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
