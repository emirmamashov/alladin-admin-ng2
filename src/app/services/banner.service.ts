import { Injectable } from '@angular/core';
import { Headers, RequestOptions, Http } from '@angular/http';

// rxjs
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

// config
import { Api_config } from '../config';

// models
import { Banner } from '../models/banner';

// services
import { HandleService } from './handle.service';
import { MyLocalStorageService } from './local-storage.service';

@Injectable()
export class BannerService {

  constructor(
    private http: Http,
    private handleService: HandleService,
    private localStorage: MyLocalStorageService
  ) { }

  getAll(): Observable<any> {
    const url: string = Api_config.banner.getAll.url;
    const token = this.localStorage.getToken();
    if (!token) {
      return this.handleService.returnError('token is null');
    }
    const headers = new Headers({
      'Content-type': 'json/application',
      'alladin-access-token': token
    });
    const options = new RequestOptions({ headers: headers });

    return this.http.get(url, options)
            .map(res => res.json())
            .catch(this.handleService.returnError);
  }

  add(files: File[], banner: Banner): Observable<any> {
    const url: string = Api_config.banner.add.url;
    const token = this.localStorage.getToken();
    if (!token) {
      return this.handleService.returnError('token is null');
    }
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('file', file);
    });
    formData.append('category', banner.category || '');
    formData.append('name', banner.name || '');
    formData.append('buttonLink', banner.buttonLink || '');
    formData.append('buttonName', banner.buttonName || '');
    formData.append('isShowInMainPage', banner.isShowInMainPage ? '1' : '0');

    // formData.append('token', String(token));

    return this.http.post(url, formData)
          .map(res => res.json())
          .catch(this.handleService.returnError);
  }

  update(files: File[], banner: Banner): Observable<any> {
    const url: string = Api_config.banner.update.url + '/' + banner._id;
    const formData = new FormData();
    if (files && files.length > 0) {
      files.forEach((file) => {
        formData.append('file', file);
      });
    }
    formData.append('name', banner.name || '');
    formData.append('category', banner.category || '');
    formData.append('buttonLink', banner.buttonLink || '');
    formData.append('buttonName', banner.buttonName || '');
    formData.append('isShowInMainPage', banner.isShowInMainPage ? '1' : '0');

    if (banner && banner.images && banner.images.length > 0) {
      if (banner.images.length === 1) {
        formData.append('images', '');
      }
      banner.images.forEach((image) => {
        formData.append('images', image);
      });
    }
    formData.append('image', banner.image || '');

    return this.http.put(url, formData)
          .map(res => res.json())
          .catch(this.handleService.returnError);
  }

  remove(_id: string): Observable<any> {
    const url: string = Api_config.banner.remove.url + '/' + _id;

    return this.http.delete(url)
        .map(res => res.json())
        .catch(this.handleService.handleError);
  }
}
