import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

// rxjs
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

// config
import { Api_config } from '../config';

// models
import { Filter } from '../models/filter';

// services
import { HandleService } from './handle.service';
import { MyLocalStorageService } from './local-storage.service';

@Injectable()
export class FiltersService {

  constructor(
    private http: Http,
    private handleService: HandleService,
    private localStorage: MyLocalStorageService
  ) { }

  getAll(): Observable<any> {
    const url: string = Api_config.filters.getAll.url;
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

  add(filter: Filter): Observable<any> {
    const url: string = Api_config.filters.add.url;
    const token = this.localStorage.getToken();
    if (!token) {
      return this.handleService.returnError('token is null');
    }
    const body = {
      name: filter.name,
      token: token
    }
    return this.http.post(url, body)
          .map(res => res.json())
          .catch(this.handleService.returnError);
  }

  update(filter: Filter): Observable<any> {
    const url: string = Api_config.filters.update.url + '/' + filter._id;
    const token = this.localStorage.getToken();
    if (!token) {
      return this.handleService.returnError('token is null');
    }
    const body = {
      name: filter.name,
      token: token
    }
    return this.http.put(url, body)
          .map(res => res.json())
          .catch(this.handleService.returnError);
  }

  remove(_id: string): Observable<any> {
    const url: string = Api_config.filters.remove.url + '/' + _id;

    return this.http.delete(url)
        .map(res => res.json())
        .catch(this.handleService.handleError);
  }
}
