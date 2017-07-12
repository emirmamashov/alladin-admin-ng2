import { TestBed, inject } from '@angular/core/testing';

import { TranslitService } from './translit.service';

describe('TranslitService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TranslitService]
    });
  });

  it('should be created', inject([TranslitService], (service: TranslitService) => {
    expect(service).toBeTruthy();
  }));
});
