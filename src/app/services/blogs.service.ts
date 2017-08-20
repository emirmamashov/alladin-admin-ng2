import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

// rxjs
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

// config
import { Api_config } from '../config';

// models
import { Blog } from '../models/blog';

// services
import { HandleService } from './handle.service';
import { MyLocalStorageService } from './local-storage.service';

@Injectable()
export class BlogsService {

  constructor(
    private http: Http,
    private handleService: HandleService,
    private localStorage: MyLocalStorageService
  ) { }

  getAll(): Observable<any> {
    const url: string = Api_config.blogs.getAll.url;
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

  add(blog: Blog): Observable<any> {
    const token = this.localStorage.getToken();
    if (!token) {
      return this.handleService.returnError('token is null');
    }
    blog['token'] = token;
    const url: string = Api_config.blogs.add.url;
    return this.http.post(url, blog)
          .map(res => res.json())
          .catch(this.handleService.returnError);
  }

  update(blog: Blog): Observable<any> {
    const url: string = Api_config.blogs.update.url + '/' + blog._id;
    const token = this.localStorage.getToken();
    if (!token) {
      return this.handleService.returnError('token is null');
    }
    blog['token'] = token;

    return this.http.put(url, blog)
          .map(res => res.json())
          .catch(this.handleService.returnError);
  }

  remove(_id: string): Observable<any> {
    const token = this.localStorage.getToken();
    if (!token) {
      return this.handleService.returnError('token is null');
    }
    const url: string = Api_config.blogs.remove.url + '/' + _id;
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
