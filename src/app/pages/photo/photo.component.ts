import { Component, OnInit, OnDestroy } from '@angular/core';

// config
import { Notify_config, Api_config } from '../../config';

// models
import { Photo } from '../../models/photo';
import { ResponseApi } from '../../models/response';
import { Notify } from '../../models/notify';
import { SelectItem } from 'primeng/primeng';


// services
import { PhotoService } from '../../services/photo.service';
import { NotifyService } from '../../services/notify.service';

declare let $: any;

@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.css'],
  providers: [
    PhotoService
  ]
})
export class PhotoComponent implements OnInit, OnDestroy {
  photos = new Array<Photo>();
  newPhoto = new Photo();
  addConnection: any;
  getAllConnection: any;

  apiUrl = Api_config.rootUrl;

  constructor(
    private photoService: PhotoService,
    private notifyService: NotifyService
  ) { }

  ngOnInit() {
    this.getAll();
  }

  getAll() {
    this.getAllConnection = this.photoService.getAll().subscribe(
      (response: ResponseApi) => {
        console.log(response);
        if (response.success) {
          this.photos = response.data.data.photos;
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  add(file: any, photo: Photo) {
    console.dir(photo);
    console.dir(file);
    const notify = new Notify();
    notify.type = Notify_config.typeMessage.danger;
    notify.text = 'Что то пошло не так!';

    this.addConnection = this.photoService.add(file.files, photo).subscribe(
      (response: ResponseApi) => {
        console.log(response);
        if (!response.success) {
          notify.text = response.message;
          return this.notifyService.addNotify(notify);
        }
        const newPhoto: Photo = response.data.data.photo;
        this.photos.push(newPhoto);

        notify.type = Notify_config.typeMessage.success;
        notify.text = 'Добавлено!';
        this.notifyService.addNotify(notify);
        this.newPhoto = new Photo();

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
