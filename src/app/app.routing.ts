import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { IndexComponent } from './pages/index.component';
import { ProductComponent } from './pages/product/product.component';

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
    path: '**',
    component: ProductComponent // page not found
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(APP_ROUTES) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule {}
