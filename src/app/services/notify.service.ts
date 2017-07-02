import { Injectable } from '@angular/core';

// models
import { Notify } from '../models/notify';

/* Const */
declare let $: any;

@Injectable()
export class NotifyService {
    constructor() {}

    addNotify(notifyOptions: Notify) {

        return $.notify({
                    message: notifyOptions.text,
                    url: notifyOptions.url,
                    icon: 'glyphicon glyphicon-warning-sign',
                }, {
                    // settings
                    animate: {
                        enter: 'animated bounceIn',
                        exit: 'animated bounceOut'
                    },
                    type: notifyOptions.type,
                    delay: notifyOptions.delay || 3000,
                    timer: notifyOptions.delay || 1000,
                    z_index: 1051
                });
    }
}
