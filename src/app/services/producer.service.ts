import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

// rxjs
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

// config
import { Api_config } from '../config';

// models
import { Producer } from '../models/producer';

// services
import { HandleService } from './handle.service';

@Injectable()
export class ProducerService {

  constructor(
    private http: Http,
    private handleService: HandleService
  ) { }

  getAll(): Observable<any> {
    const url: string = Api_config.producer.getAll.url;
    const headers = new Headers({
      'Content-type': 'json/application'
    });
    const options = new RequestOptions({headers: headers});

    return this.http.get(url, options)
            .map(res => res.json())
            .catch(this.handleService.returnError);
  }

  add(files: File[], producer: Producer): Observable<any> {
    const url: string = Api_config.producer.add.url;
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('file', file);
    });
    formData.append('name', producer.name || '');
    formData.append('description', producer.description || '');
    formData.append('keywords', producer.keywords || '');
    formData.append('author', producer.author || '');

    return this.http.post(url, formData)
          .map(res => res.json())
          .catch(this.handleService.returnError);
  }
}
