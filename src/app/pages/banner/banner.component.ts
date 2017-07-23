import { Component, OnInit, OnDestroy } from '@angular/core';

// config
import { Notify_config, Api_config } from '../../config';

// models
import { Banner } from '../../models/banner';
import { Photo } from '../../models/photo';
import { ResponseApi } from '../../models/response';
import { Notify } from '../../models/notify';
import { SelectItem } from 'primeng/primeng';

// services
import { BannerService } from '../../services/banner.service';
import { NotifyService } from '../../services/notify.service';
import { PhotoService } from '../../services/photo.service';

declare let $: any;
@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css'],
  providers: [
    BannerService,
    PhotoService
  ]
})
export class BannerComponent implements OnInit, OnDestroy {
  banners = new Array<Banner>();
  newBanner = new Banner();
  photos = new Array<Photo>();
  bannersItem: SelectItem[] = [];
  photosSelectItems: SelectItem[] = [];

  filesToReadyUpload = new Array<any>();

  isEdit = false;
  apiUrl: string = Api_config.rootUrl;

  getAllConnection: any;
  addConnection: any;
  updateConnection: any;
  getAllPhotosConnection: any;

  constructor(
    private bannerService: BannerService,
    private notifyService: NotifyService,
    private photoService: PhotoService
  ) { }

  ngOnInit() {
    this.bannersItem.push({ label: 'Выбрите категорию', value: '' });
    this.getAll();
    this.getAllPhotos();
  }

  getAll() {
    this.getAllConnection = this.bannerService.getAll().subscribe(
      (response: ResponseApi) => {
        console.log(response);
        if (response.success) {
          this.banners = response.data.data.banners;
          this.setBannersItem(this.banners);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getAllPhotos() {
    this.getAllPhotosConnection = this.photoService.getAll().subscribe(
      (response: ResponseApi) => {
        console.log(response);
        if (response.success) {
          this.photos = response.data.data.photos;
          this.setPhotosItem(this.photos);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  setBannersItem(banners: Array<Banner>) {
    banners.forEach((category) => {
      this.bannersItem.push({ label: category.name, value: category._id });
    });
  }

  setPhotosItem(photos: Array<Photo>) {
    photos.forEach((photo) => {
      this.photosSelectItems.push({ label: photo.name, value: {id: photo._id, url: Api_config.rootUrl + '/' + photo.url }});
    });
  }

  add(banner: Banner) {
    console.dir(banner);

    const notify = new Notify();
    notify.type = Notify_config.typeMessage.danger;
    notify.text = 'Что то пошло не так!';

    const files = new Array<File>();
    this.filesToReadyUpload.forEach((fileObject) => {
      files.push(fileObject.file);
    });

    this.addConnection = this.bannerService.add(files, banner).subscribe(
      (response: ResponseApi) => {
        console.log(response);
        if (!response.success) {
          notify.text = response.message;
          return this.notifyService.addNotify(notify);
        }
        const newBanner: Banner = response.data.data.banner;
        this.banners.push(newBanner);
        this.bannersItem.push({ label: newBanner.name, value: newBanner._id });

        notify.type = Notify_config.typeMessage.success;
        notify.text = 'Добавлено!';
        this.notifyService.addNotify(notify);
        this.newBanner = new Banner();

        $('#modal').modal('toggle');
      },
      (err) => {
        console.log(err);
        this.notifyService.addNotify(notify);
      }
    );
  }

  update(banner: Banner) {

    const notify = new Notify();
    notify.type = Notify_config.typeMessage.danger;
    notify.text = 'Что то пошло не так!';

    this.updateConnection = this.bannerService.update(banner).subscribe(
      (response: ResponseApi) => {
        console.log(response);
        if (!response.success) {
          notify.text = response.message;
          return this.notifyService.addNotify(notify);
        }

        notify.type = Notify_config.typeMessage.success;
        notify.text = 'Обнавлено!';
        this.notifyService.addNotify(notify);
        this.newBanner = new Banner();

        $('#modal').modal('toggle');
      },
      (err) => {
        console.log(err);
        this.notifyService.addNotify(notify);
      }
    );
  }

  changeEditStatus(status: boolean) {
    this.isEdit = status;
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
              this.filesToReadyUpload.push(fileObject);
            };
            reader.readAsDataURL(files[i]);
          } else {
            console.log('invalid format');
          }
      }
    }
  }

  removeInListREadyUpload(fileName: string) {
    this.filesToReadyUpload = this.filesToReadyUpload.filter(x => x.name !== fileName);
  }

  ngOnDestroy() {
    if (this.getAllConnection && this.getAllConnection.unsubscribe) {
      this.getAllConnection.unsubscribe();
    }
    if (this.addConnection && this.addConnection.unsubscribe) {
      this.addConnection.unsubscribe();
    }
    if (this.updateConnection && this.updateConnection.unsubscribe) {
      this.updateConnection.unsubscribe();
    }
    if (this.getAllPhotosConnection && this.getAllPhotosConnection.unsubscribe) {
      this.getAllPhotosConnection.unsubscribe();
    }
  }

}
