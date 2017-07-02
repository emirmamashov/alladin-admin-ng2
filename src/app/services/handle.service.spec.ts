import { TestBed, inject } from '@angular/core/testing';

import { HandleService } from './handle.service';

describe('HandleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HandleService]
    });
  });

  it('should be created', inject([HandleService], (service: HandleService) => {
    expect(service).toBeTruthy();
  }));
});
