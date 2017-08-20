import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule, Http } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app.routing';

// localstorage
import { LocalStorageModule, LocalStorageService } from 'angular-2-local-storage';
import { WindowRef } from './services/window.service';
import { MyLocalStorageService } from './services/local-storage.service';

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
import { AuthService } from './services/auth.service';

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
import { UsersComponent } from './pages/users/users.component';
import { LoginComponent } from './pages/account/login/login.component';
import { TopBarComponent } from './components/nav-bars/top-bar/top-bar.component';
import { BlogsComponent } from './pages/blogs/blogs.component';

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
    BannerComponent,
    UsersComponent,
    LoginComponent,
    TopBarComponent,
    BlogsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpModule,
    BrowserAnimationsModule,
    CKEditorModule,

    LocalStorageModule.withConfig({
      prefix: 'app-root',
      storageType: 'localStorage'
    }),

    DropdownModule,
    FileUploadModule,
    MultiSelectModule
  ],
  providers: [
    LocalStorageService,
    MyLocalStorageService,
    WindowRef,
    HandleService,
    NotifyService,
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
