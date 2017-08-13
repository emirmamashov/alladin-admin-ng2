// core
import { Injectable } from '@angular/core';

// models
import { User } from '../models/user';

// services
import { LocalStorageService } from 'angular-2-local-storage';

@Injectable()
export class MyLocalStorageService {

  constructor(
    private localStorageService: LocalStorageService
  ) { }

  get(name: string): any {
    return this.localStorageService.get(name);
  }

  set(name: string, value: any): any {
    if (this.localStorageService.get(name)) {
      this.localStorageService.set(name, value);
    } else {
      this.localStorageService.add(name, value);
    }
  }

  setUser(user: User) {
    this.localStorageService.set('user', user);
  }

  getUser() {
    return this.localStorageService.get('user');
  }

  setToken(token: string) {
    this.localStorageService.set('token', token);
  }

  getToken() {
    return this.localStorageService.get('token');
  }

  clearStorage() {
    this.setToken(null);
    this.setUser(null);
  }
}
