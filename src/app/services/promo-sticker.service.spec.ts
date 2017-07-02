import { TestBed, inject } from '@angular/core/testing';

import { PromoStickerService } from './promo-sticker.service';

describe('PromoStickerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PromoStickerService]
    });
  });

  it('should be created', inject([PromoStickerService], (service: PromoStickerService) => {
    expect(service).toBeTruthy();
  }));
});
