import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

// rxjs
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

// config
import { Api_config } from '../config';

// models
import { User } from '../models/user';

// services
import { HandleService } from './handle.service';
import { MyLocalStorageService } from './local-storage.service';

@Injectable()
export class UsersService {

  constructor(
    private http: Http,
    private handleService: HandleService,
    private localStorage: MyLocalStorageService
  ) { }

  getAll(): Observable<any> {
    const url: string = Api_config.users.getAll.url;
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

  add(user: User): Observable<any> {
    const token = this.localStorage.getToken();
    if (!token) {
      return this.handleService.returnError('token is null');
    }
    user['token'] = token;
    const url: string = Api_config.users.add.url;
    return this.http.post(url, user)
          .map(res => res.json())
          .catch(this.handleService.returnError);
  }

  update(user: User): Observable<any> {
    const url: string = Api_config.users.update.url + '/' + user._id;
    const token = this.localStorage.getToken();
    if (!token) {
      return this.handleService.returnError('token is null');
    }
    user['token'] = token;

    return this.http.put(url, user)
          .map(res => res.json())
          .catch(this.handleService.returnError);
  }

  remove(_id: string): Observable<any> {
    const token = this.localStorage.getToken();
    if (!token) {
      return this.handleService.returnError('token is null');
    }
    const url: string = Api_config.users.remove.url + '/' + _id;
    const headers = new Headers({
      'Content-type': 'json/application',
      'alladin-access-token': token
    });
    const options = new RequestOptions({headers: headers});

    return this.http.delete(url, options)
        .map(res => res.json())
        .catch(this.handleService.handleError);
  }
}
