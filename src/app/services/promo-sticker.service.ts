import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';

// rxjs
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

// config
import { Api_config } from '../config';

// models
import { PromoSticker } from '../models/promo-sticker';

// services
import { HandleService } from './handle.service';

@Injectable()
export class PromoStickerService {

  constructor(
    private http: Http,
    private handleService: HandleService
  ) { }

  getAll(): Observable<any> {
    const url: string = Api_config.promoSticker.getAll.url;
    const headers = new Headers({
      'Content-type': 'json/application'
    });
    const options = new RequestOptions({
      headers: headers
    });

    return this.http.get(url, options)
            .map(res => res.json())
            .catch(this.handleService.returnError);
  }

  add(files: File[], promoSticker: PromoSticker): Observable<any> {
    const url: string = Api_config.promoSticker.add.url;
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('file', files[i]);
    }
    formData.append('name', promoSticker.name);

    return this.http.post(url, formData)
            .map(res => res.json())
            .catch(this.handleService.returnError);
  }
}
