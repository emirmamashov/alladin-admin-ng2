import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule, Http } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app.routing';

// primng
import {
  DropdownModule,
  FileUploadModule,
  MultiSelectModule
} from 'primeng/primeng';

// services
import { HandleService } from './services/handle.service';
import { NotifyService } from './services/notify.service';

// component
import { AppComponent } from './app.component';
import { IndexComponent } from './pages/index.component';
import { ProductComponent } from './pages/product/product.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { CategoryComponent } from './pages/category/category.component';

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    ProductComponent,
    ProductDetailComponent,
    CategoryComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpModule,
    BrowserAnimationsModule,

    DropdownModule,
    FileUploadModule,
    MultiSelectModule
  ],
  providers: [
    HandleService,
    NotifyService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
