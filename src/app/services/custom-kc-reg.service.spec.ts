import { TestBed } from '@angular/core/testing';

import { CustomKcRegService } from './custom-kc-reg.service';

describe('CustomKcRegService', () => {
  let service: CustomKcRegService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomKcRegService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
