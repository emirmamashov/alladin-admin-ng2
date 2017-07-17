import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';

// rxjs
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

// config
import { Api_config } from '../config';

// models
import { Photo } from '../models/photo';

// services
import { HandleService } from './handle.service';


@Injectable()
export class PhotoService {

  constructor(
    private http: Http,
    private handleErrorService: HandleService
  ) { }

  add(files: File[], photo: Photo) {
    const url: string = Api_config.photo.add.url;
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('file', files[i]);
    }
    formData.append('name', photo.name || '');
    formData.append('description', photo.description || '');
    formData.append('htmlH1', photo.htmlH1 || '');
    formData.append('htmlTitle', photo.htmlTitle || '');
    formData.append('keywords', photo.keywords || '');
    formData.append('metaDescription', photo.metaDescription || '');

    return this.http.post(url, formData)
            .map(res => res.json())
            .catch(this.handleErrorService.returnError);
  }
}
