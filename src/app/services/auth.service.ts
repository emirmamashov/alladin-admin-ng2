import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http } from '@angular/http';

// rxjs
import { Observable } from 'rxjs/Observable';
import 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

// config
import {
  Api_config,
  Notify_config
} from '../config';

// models
import { User } from '../models/user';
import { Notify } from '../models/notify';

// services
import { HandleService } from './handle.service';
import { MyLocalStorageService } from './local-storage.service';
import { WindowRef } from './window.service';
import { NotifyService } from './notify.service';

@Injectable()
export class AuthService {
  private window: any;

  constructor(
    private windowRef: WindowRef,
    private localStorage: MyLocalStorageService,
    private router: Router,
    private handleService: HandleService,
    private http: Http
  ) {
    this.window = this.windowRef.getNativeWindow();
  }

   isCheckAuthRedirectToLogin(): Boolean { // проверка что пользователь авторизован
    console.log('-----------проверка что пользователь авторизован-------------------');
    const user = this.localStorage.getUser();
    const token = this.localStorage.getToken();

    if (!token) { // if (!user || !user._id || !token) {
      console.log('Вы не авторизованы');
      this.router.navigate(['/login']);
      return true;
    }
    console.log('авторизован');
    return false;
  }

  isCheckAuthRedirectToProfile(): Boolean { // проверка что пользователь авторизован
    console.log('-----------isCheckAuthRedirectToProfile----------');
    const user = this.localStorage.getUser();
    const token = this.localStorage.getToken();

    if (user && token) { // if (user && user._id && token) {
      console.log('Вы авторизованы');
      this.router.navigate(['/profile']);
      return true;
    }
    console.log('не авторизован');
    return false;
  }
  login(email: string, password: string): Observable<any> {
    const url: string = Api_config.auth.loginAdmin.url;
    const body = {
      email: email,
      password: password
    };
    return this.http.post(url, body)
          .map(res => res.json())
          .catch(this.handleService.returnError);
  }

  logout() {
    this.localStorage.clearStorage();
    this.router.navigate(['/login']);
  }

}
