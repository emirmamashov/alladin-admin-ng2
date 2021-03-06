import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CountProductsComponent } from './count-products.component';

describe('CountProductsComponent', () => {
  let component: CountProductsComponent;
  let fixture: ComponentFixture<CountProductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CountProductsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
