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

import { CKEditorModule } from 'ng2-ckeditor';

// services
import { HandleService } from './services/handle.service';
import { NotifyService } from './services/notify.service';

// component
import { AppComponent } from './app.component';
import { IndexComponent } from './pages/index.component';
import { ProductComponent } from './pages/product/product.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { CategoryComponent } from './pages/category/category.component';
import { ProducerComponent } from './pages/producer/producer.component';
import { PromoStickerComponent } from './pages/promo-sticker/promo-sticker.component';
import { ImportComponent } from './pages/product/import/import.component';
import { BannerComponent } from './pages/banner/banner.component';

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    ProductComponent,
    ProductDetailComponent,
    CategoryComponent,
    ProducerComponent,
    PromoStickerComponent,
    ImportComponent,
    BannerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpModule,
    BrowserAnimationsModule,
    CKEditorModule,

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
