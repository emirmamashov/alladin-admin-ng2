import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromoStickerComponent } from './promo-sticker.component';

describe('PromoStickerComponent', () => {
  let component: PromoStickerComponent;
  let fixture: ComponentFixture<PromoStickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromoStickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromoStickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
