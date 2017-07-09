import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';

// rx
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

// config
import { Api_config } from '../config';

// models
import { Product } from '../models/product';

// services
import { HandleService } from './handle.service';

@Injectable()
export class ProductService {

  constructor(
    private http: Http,
    private handleService: HandleService
  ) { }

  getAll(): Observable<any> {
    const url: string = Api_config.product.getAll.url;
    const headers = new Headers({
      'Content-type': 'json/application'
    });
    const options = new RequestOptions({headers: headers});

    return this.http.get(url, options)
          .map(res => res.json())
          .catch(this.handleService.handleError);
  }

  getById(id: string): Observable<any> {
    const url: string = Api_config.product.getById.url + '/' + id;
    const headers = new Headers({
      'Content-type': 'json/application'
    });
    const options = new RequestOptions({headers: headers});

    return this.http.get(url, options)
          .map(res => res.json())
          .catch(this.handleService.handleError);
  }

  add(files: File[], product: Product): Observable<any> {
    const url: string = Api_config.product.add.url;
    const formData = new FormData();
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        formData.append('file', files[i]);
      }
    }
    if (product.categories && product.categories.length > 0) {
      for (let j = 0; j < product.categories.length; j++) {
        formData.append('categories', product.categories[j]);
      }
    }

    const phone = product.phone ? product.phone.toString() : '';
    const price = product.price ? product.price.toString() : '';
    const priceStock = product.priceStock ? product.priceStock.toString() : '';

    formData.append('categoryId', product.categoryId || '');
    formData.append('description', product.description || '');
    formData.append('htmlH1', product.htmlH1 || '');
    formData.append('htmlTitle', product.htmlTitle || '');
    formData.append('metaDescription', product.metaDescription || '');
    formData.append('metaKeywords', product.metaKeywords || '');
    formData.append('name', product.name || '');
    formData.append('phone', phone || '');
    formData.append('price', price || '');
    formData.append('priceStock', priceStock || '');
    formData.append('producerId', product.producerId || '');
    formData.append('promoStickers', product.promoStickers || '');
    formData.append('seoUrl', product.seoUrl || '');
    formData.append('tegs', product.tegs || '');

    return this.http.post(url, formData)
          .map(res => res.json())
          .catch(this.handleService.handleError);
  }

    edit(files: File[], product: Product): Observable<any> {
    const url: string = Api_config.product.edit.url;
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('file', files[i]);
    }
    for (let j = 0; j < product.categories.length; j++) {
      formData.append('categories', product.categories[j]);
    }
    formData.append('categoryId', product.categoryId || '');
    formData.append('description', product.description || '');
    formData.append('htmlH1', product.htmlH1 || '');
    formData.append('htmlTitle', product.htmlTitle || '');
    formData.append('metaDescription', product.metaDescription || '');
    formData.append('metaKeywords', product.metaKeywords || '');
    formData.append('name', product.name || '');
    formData.append('phone', product.phone.toString());
    formData.append('price', product.price.toString());
    formData.append('priceStock', product.priceStock.toString());
    formData.append('producerId', product.producerId || '');
    formData.append('promoStickers', product.promoStickers || '');
    formData.append('seoUrl', product.seoUrl || '');
    formData.append('tegs', product.tegs || '');
    formData.append('_id', product._id || '');

    return this.http.put(url, formData)
          .map(res => res.json())
          .catch(this.handleService.handleError);
  }

}
