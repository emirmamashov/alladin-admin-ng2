import { Injectable } from '@angular/core';
import { Headers, RequestOptions, Http } from '@angular/http';

// rxjs
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

// config
import { Api_config } from '../config';

// services
import { HandleService } from './handle.service';

@Injectable()
export class ExelService {

  constructor(
    private http: Http,
    private handleService: HandleService
  ) { }

  import(files: File[]): Observable<any> {
    console.log('--------------------import------------');
    if (!files || files.length === 0) {
      return this.handleService.returnError('not have files');
    }
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      console.dir(files[i]);
      formData.append('file', files[i]);
    }
    const url: string = Api_config.product.import.url;
    return this.http.post(url, formData)
            .map(res => res.json())
            .catch(this.handleService.handleError);
  }

}
