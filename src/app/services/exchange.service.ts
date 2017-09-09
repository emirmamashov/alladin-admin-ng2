import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

// rxjs
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

// config
import { Api_config } from '../config';

// models
import { Exchange } from '../models/exchange';

// services
import { HandleService } from './handle.service';
import { MyLocalStorageService } from './local-storage.service';

@Injectable()
export class ExchangeService {

  constructor(
    private http: Http,
    private handleService: HandleService,
    private localStorage: MyLocalStorageService
  ) { }

  get(): Observable<any> {
    const url: string = Api_config.exchange.get.url;
    const token = this.localStorage.getToken();
    if (!token) {
      return this.handleService.returnError('token is null');
    }
    const headers = new Headers({
      'Content-type': 'json/application',
      'alladin-access-token': token
    });
    const options = new RequestOptions({headers: headers});

    return this.http.get(url, options)
            .map(res => res.json())
            .catch(this.handleService.returnError);
  }


  update(exchange: Exchange): Observable<any> {
    const url: string = Api_config.exchange.update.url + '/' + exchange._id;
    const token = this.localStorage.getToken();
    if (!token) {
      return this.handleService.returnError('token is null');
    }
    exchange['token'] = token;

    return this.http.put(url, exchange)
          .map(res => res.json())
          .catch(this.handleService.returnError);
  }
}
