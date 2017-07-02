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

  add(producer: Producer): Observable<any> {
    const url: string = Api_config.producer.add.url;
    return this.http.post(url, producer)
            .map(res => res.json())
            .catch(this.handleService.returnError);
  }
}
