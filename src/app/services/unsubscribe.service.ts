// core
import { Injectable } from '@angular/core';

@Injectable()
export class UnsubscribeService {

  constructor() { }

  unsubscribing(obj: any) {
    if (obj && obj.unsubscribe) {
      obj.unsubscribe();
    }
  }

  unsubscribings(objs: any) {
    if (!objs || objs.length === 0) {
      return console.log('objs is null');
    }
    objs.forEach((obj) => {
      this.unsubscribing(obj);
    });
  }

}
