import { Component, OnInit, OnDestroy } from '@angular/core';

// config
import { Notify_config, Api_config } from '../../config';

// models
import { PromoSticker } from '../../models/promo-sticker';
import { ResponseApi } from '../../models/response';
import { Notify } from '../../models/notify';

// services
import { PromoStickerService } from '../../services/promo-sticker.service';
import { NotifyService } from '../../services/notify.service';

declare let $: any;
@Component({
  selector: 'app-promo-sticker',
  templateUrl: './promo-sticker.component.html',
  styleUrls: ['./promo-sticker.component.css'],
  providers: [ PromoStickerService ]
})
export class PromoStickerComponent implements OnInit, OnDestroy {
  promoStickers = new Array<PromoSticker>();
  newPromoSticker = new PromoSticker();
  isEdit = false;
  apiUrl: string = Api_config.rootUrl;

  private addConnection: any;
  private getAllConnection: any;

  constructor(
    private promoStickerService: PromoStickerService,
    private notifyService: NotifyService
  ) { }


  ngOnInit() {
    this.getAll();
  }

  getAll() {
    this.getAllConnection = this.promoStickerService.getAll().subscribe(
      (response: ResponseApi) => {
        console.log(response);
        if (response.success) {
          this.promoStickers = response.data.data.promoStickers;
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }
    add(file: any, promoSticker: PromoSticker) {
    console.dir(file);
    const notify = new Notify();
    notify.type = Notify_config.typeMessage.danger;
    notify.text = 'Что то пошло не так!';

    this.addConnection = this.promoStickerService.add(file.files, promoSticker).subscribe(
      (response: ResponseApi) => {
        console.log(response);
        if (!response.success) {
          notify.text = response.message;
          return this.notifyService.addNotify(notify);
        }
        const newCategory: PromoSticker = response.data.data.promoSticker;
        this.promoStickers.push(newCategory);
        notify.type = Notify_config.typeMessage.success;
        notify.text = 'Добавлено!';
        this.notifyService.addNotify(notify);
        this.newPromoSticker = new PromoSticker();

        $('#modal').modal('toggle');
      },
      (err) => {
        console.log(err);
        this.notifyService.addNotify(notify);
      }
    );
  }

  ngOnDestroy() {
    if (this.addConnection && this.addConnection.unsubscribe) {
      this.addConnection.unsubscribe();
    }
    if (this.getAllConnection && this.getAllConnection.unsubscribe) {
      this.getAllConnection.unsubscribe();
    }
  }
}
