import { TestBed, inject } from '@angular/core/testing';

import { UnsubscribeService } from './unsubscribe.service';

describe('UnsubscribeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UnsubscribeService]
    });
  });

  it('should be created', inject([UnsubscribeService], (service: UnsubscribeService) => {
    expect(service).toBeTruthy();
  }));
});
