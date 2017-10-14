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

  getAll(page: number, limit: number, searchText: string): Observable<any> {
    const url: string = Api_config.product.getAll.url + '?page=' + page + '&limit=' + limit + '&searchtext=' + searchText;
    const headers = new Headers({
      'Content-type': 'json/application'
    });
    const options = new RequestOptions({ headers: headers });

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
    for (let i = 0; i < files.length; i++) {
      formData.append('file', files[i]);
    }

    if (product.categories && product.categories.length > 0) {
      for (let j = 0; j < product.categories.length; j++) {
        formData.append('categories', product.categories[j]);
      }
    }

    if (product.filters && product.filters.length > 0) {
      for (let j = 0; j < product.filters.length; j++) {
        formData.append('filters', product.filters[j]);
      }
    }

    formData.append('categoryId', product.categoryId || '');
    formData.append('description', product.description || '');
    formData.append('htmlH1', product.htmlH1 || '');
    formData.append('htmlTitle', product.htmlTitle || '');
    formData.append('metaDescription', product.metaDescription || '');
    formData.append('metaKeywords', product.metaKeywords || '');
    formData.append('name', product.name || '');
    formData.append('phone', product.phone ? product.phone.toString() : '');
    formData.append('price', product.price ? product.price.toString() : '');
    formData.append('priceStock', product.priceStock ? product.priceStock.toString() : '');
    formData.append('producerId', product.producerId || '');
    formData.append('promoStickerId', product.promoStickerId || '');
    formData.append('seoUrl', product.seoUrl || '');
    formData.append('tegs', product.tegs || '');
    formData.append('priceTrade', product.priceTrade ? product.priceTrade.toString() : '');
    formData.append('comments', product.comments || '');
    formData.append('isHot', product.isHot ? '1' : '0');

    return this.http.post(url, formData)
          .map(res => res.json())
          .catch(this.handleService.handleError);
  }

  update(files: File[], product: Product): Observable<any> {
    const url: string = Api_config.product.edit.url;
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('file', files[i]);
    }
    if (product.categories && product.categories.length > 0) {
      for (let j = 0; j < product.categories.length; j++) {
        formData.append('categories', product.categories[j]);
      }
    }
    if (product.filters && product.filters.length > 0) {
      for (let j = 0; j < product.filters.length; j++) {
        formData.append('filters', product.filters[j]);
      }
    }
    if (product && product.images && product.images.length > 0) {
      if (product.images.length === 1) {
        formData.append('images', '');
      }
      product.images.forEach((image) => {
        formData.append('images', image);
      });
    }
    formData.append('categoryId', product.categoryId || '');
    formData.append('description', product.description || '');
    formData.append('htmlH1', product.htmlH1 || '');
    formData.append('htmlTitle', product.htmlTitle || '');
    formData.append('metaDescription', product.metaDescription || '');
    formData.append('metaKeywords', product.metaKeywords || '');
    formData.append('name', product.name || '');
    formData.append('phone', product.phone ? product.phone.toString() : '');
    formData.append('price', product.price ? product.price.toString() : '');
    formData.append('priceStock', product.priceStock ? product.priceStock.toString() : '');
    formData.append('producerId', product.producerId || '');
    formData.append('promoStickerId', product.promoStickerId || '');
    formData.append('seoUrl', product.seoUrl || '');
    formData.append('tegs', product.tegs || '');
    formData.append('_id', product._id || '');
    formData.append('priceTrade', product.priceTrade ? product.priceTrade.toString() : '');
    formData.append('comments', product.comments || '');
    formData.append('isHot', product.isHot ? '1' : '0');

    return this.http.put(url, formData)
          .map(res => res.json())
          .catch(this.handleService.handleError);
  }

  remove(_id: string): Observable<any> {
    const url: string = Api_config.product.remove.url + '/' + _id;

    return this.http.delete(url)
        .map(res => res.json())
        .catch(this.handleService.handleError);
  }

  getCountProductsByCategory(categoryId: string): Observable<any> {
    const url: string = Api_config.product.countProductsByCategoryId.url.replace(':categoryId', categoryId);

    return this.http.get(url)
        .map(res => res.json())
        .catch(this.handleService.handleError);
  }

  getProductsByCategoryId(page: number, limit: number, categoryId: string): Observable<any> {
    const url: string = Api_config.product.getProductsByCategoryId.url.replace(':categoryId', categoryId) + '?page=' + page + '&limit=' + limit;
    const headers = new Headers({
      'Content-type': 'json/application'
    });
    const options = new RequestOptions({ headers: headers });

    return this.http.get(url, options)
          .map(res => res.json())
          .catch(this.handleService.handleError);
  }

}
