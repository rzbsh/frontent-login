import { TestBed } from '@angular/core/testing';

import { CustomKcAuthService } from './custom-kc-auth.service';

describe('CustomKcAuthService', () => {
  let service: CustomKcAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomKcAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
