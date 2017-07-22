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

@Injectable()
export class BannerService {

  constructor(
    private http: Http,
    private handleService: HandleService
  ) { }

  getAll(): Observable<any> {
    const url: string = Api_config.banner.getAll.url;
    const headers = new Headers({
      'Content-type': 'json/application'
    });
    const options = new RequestOptions({ headers: headers });

    return this.http.get(url, options)
            .map(res => res.json())
            .catch(this.handleService.returnError);
  }

  add(banner: Banner): Observable<any> {
    const url: string = Api_config.banner.add.url;
    return this.http.post(url, banner)
          .map(res => res.json())
          .catch(this.handleService.returnError);
  }

  update(banner: Banner): Observable<any> {
    const url: string = Api_config.banner.update.url + '/' + banner._id;

    return this.http.put(url, banner)
        .map(res => res.json())
        .catch(this.handleService.handleError);
  }
}
