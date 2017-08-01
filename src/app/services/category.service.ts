import { Injectable } from '@angular/core';
import { Headers, RequestOptions, Http } from '@angular/http';

// rxjs
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

// config
import { Api_config } from '../config';

// models
import { Category } from '../models/category';

// services
import { HandleService } from './handle.service';

@Injectable()
export class CategoryService {

  constructor(
    private http: Http,
    private handleService: HandleService
  ) { }

  getAll(): Observable<any> {
    const url: string = Api_config.category.getAll.url;
    const headers = new Headers({
      'Content-type': 'json/application'
    });
    const options = new RequestOptions({headers: headers});

    return this.http.get(url, options)
            .map(res => res.json())
            .catch(this.handleService.returnError);
  }

  add(files: File[], category: Category): Observable<any> {
    const url: string = Api_config.category.add.url;
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('file', file);
    });
    formData.append('name', category.name || '');
    formData.append('parentCategory', category.parentCategory || '');
    formData.append('description', category.description || '');
    formData.append('keywords', category.keywords || '');
    formData.append('author', category.author || '');
    formData.append('viewInMenu', category.viewInMenu ? '1' : '0');

    return this.http.post(url, formData)
          .map(res => res.json())
          .catch(this.handleService.returnError);
  }

  update(files: File[], category: Category): Observable<any> {
    const url: string = Api_config.category.update.url + '/' + category._id;
    const formData = new FormData();
    if (files && files.length > 0) {
      files.forEach((file) => {
        formData.append('file', file);
      });
    }
    formData.append('name', category.name || '');
    formData.append('parentCategory', category.parentCategory || '');
    formData.append('description', category.description || '');
    formData.append('keywords', category.keywords || '');
    formData.append('author', category.author || '');
    formData.append('viewInMenu', category.viewInMenu ? '1' : '0');

    if (category && category.images && category.images.length > 0) {
      if (category.images.length === 1) {
        formData.append('images', '');
      }
      category.images.forEach((image) => {
        formData.append('images', image);
      });
    }
    formData.append('image', category.image || '');

    return this.http.put(url, formData)
          .map(res => res.json())
          .catch(this.handleService.returnError);
  }

  remove(_id: string): Observable<any> {
    const url: string = Api_config.category.remove.url + '/' + _id;

    return this.http.delete(url)
        .map(res => res.json())
        .catch(this.handleService.handleError);
  }
}
