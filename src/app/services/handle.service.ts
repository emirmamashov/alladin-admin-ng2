import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { ErrorMsg } from '../models/error';

@Injectable()
export class HandleService {
  handleError (error: Response | any): Observable<ErrorMsg> {
    let errMsg: ErrorMsg = new ErrorMsg();
    errMsg.status = 0;

    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);

      errMsg.message = `${error.statusText || ''} ${err}`;
      // errMsg.message = `${err}`;
      // errMsg.details = JSON.parse(errorDetail);
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    return Observable.throw(errMsg);
  }

  returnError (err: string): Observable<string> {
    return Observable.throw(err);
  }
}
