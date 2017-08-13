import {Injectable} from '@angular/core';

@Injectable()
export class WindowRef {
  getNativeWindow() {
    return window;
  }

  getNavigator() {
    return navigator;
  }

}
