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

  fileToReadyUpload: any;

  private addConnection: any;
  private getAllConnection: any;
  private updateConnection: any;
  private removeConnection: any;

  constructor(
    private promoStickerService: PromoStickerService,
    private notifyService: NotifyService
  ) { }


  ngOnInit() {
    this.getAll();
    this.clearFilesToReadUpload();
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

  changeEditStatus(status: boolean) {
    this.isEdit = status;
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

update(file: any, promoSticker: PromoSticker) {
    if (!promoSticker || !promoSticker.name) {
      return this.showMessageForUser(Notify_config.typeMessage.danger, 'Введите наименование категории');
    }

    this.updateConnection = this.promoStickerService.update(this.fileToReadyUpload.file, promoSticker).subscribe(
      (response: ResponseApi) => {
        console.log(response);
        if (!response.success) {
          return this.showMessageForUser(Notify_config.typeMessage.danger, response.message);
        }
        const updatePromoSticker: PromoSticker = response.data.data.promoSticker;
        if (updatePromoSticker) {
          promoSticker.image = updatePromoSticker.image;
        }
        this.newPromoSticker = new PromoSticker();
        this.showMessageForUser(Notify_config.typeMessage.success, response.message);
        this.clearFilesToReadUpload();
        $('#modal').modal('toggle');
      },
      (err) => {
        console.log(err);
        this.showMessageForUser(Notify_config.typeMessage.warning, 'Что то пошло не так');
      }
    );
  }

  clearFilesToReadUpload() {
    this.fileToReadyUpload = {
                name: '',
                data: '',
                file: ''
    };
  }

  addToListReadyupload(fileInput: any) {
    console.dir(fileInput);
    console.dir(event);
    const files = fileInput.files;
    // const files = event.dataTransfer ? event.dataTransfer.files : event.target.files;

    if (files && files.length > 0) {
      // console.dir(files);
      for (let i = 0; i < files.length; i++) {
          const pattern = /image-*/;
          const reader = new FileReader();
          if (files[i].type.match(pattern)) {
            reader.onload = (e: any) => {
              console.dir('reader.onload');
              const readerFile = e.target;
              const fileObject = {
                name: files[i].name,
                data: readerFile.result,
                file: files[i]
              };
              this.fileToReadyUpload = fileObject;
            };
            reader.readAsDataURL(files[i]);
          } else {
            console.log('invalid format');
          }
      }
    }
  }

  remove(_id: string) {
    this.removeConnection = this.promoStickerService.remove(_id).subscribe(
      (response: ResponseApi) => {
        console.log(response);
        if (!response.success) {
          this.showMessageForUser(Notify_config.typeMessage.danger, response.message);
          return;
        }
        this.removeInListPromoSticker(response.data.data.promoSticker);
        this.showMessageForUser(Notify_config.typeMessage.success, response.message);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  removeInListPromoSticker(promoSticker: PromoSticker) {
    if (promoSticker && promoSticker._id) {
      this.promoStickers = this.promoStickers.filter(x => x._id !== promoSticker._id);
    }
  }

  clearNewPromoSticker() {
    this.newPromoSticker = new PromoSticker();
  }

  showMessageForUser(typeMessage: string, text: string) {
    const notify = new Notify();
    notify.type = typeMessage;
    notify.text = text;
    this.notifyService.addNotify(notify);
  }

  ngOnDestroy() {
    if (this.addConnection && this.addConnection.unsubscribe) {
      this.addConnection.unsubscribe();
    }
    if (this.getAllConnection && this.getAllConnection.unsubscribe) {
      this.getAllConnection.unsubscribe();
    }
    if (this.updateConnection && this.updateConnection.unsubscribe) {
      this.updateConnection.unsubscribe();
    }
    if (this.removeConnection && this.removeConnection.unsubscribe) {
      this.removeConnection.unsubscribe();
    }
  }
}
