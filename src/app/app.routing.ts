import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { IndexComponent } from './pages/index.component';
import { ProductComponent } from './pages/product/product.component';
import { CategoryComponent } from './pages/category/category.component';
import { ProducerComponent } from './pages/producer/producer.component';
import { PromoStickerComponent } from './pages/promo-sticker/promo-sticker.component';

const APP_ROUTES: Routes = [
  {
    path: '',
    component: ProductComponent
  },
  {
    path: 'products',
    component: ProductComponent
  },
  {
    path: 'categories',
    component: CategoryComponent
  },
  {
    path: 'producers',
    component: ProducerComponent
  },
  {
    path: 'promo-stickers',
    component: PromoStickerComponent
  },
  {
    path: '**',
    component: ProductComponent // page not found
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(APP_ROUTES) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule {}
