import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { IndexComponent } from './pages/index.component';
import { ProductComponent } from './pages/product/product.component';

const APP_ROUTES: Routes = [
  {
    path: '',
    component: IndexComponent
  },
  {
    path: 'products',
    component: ProductComponent
  },
  {
    path: '**',
    component: IndexComponent // page not found
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(APP_ROUTES) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule {}
