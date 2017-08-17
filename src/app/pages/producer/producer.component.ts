import { Component, OnInit, OnDestroy } from '@angular/core';

// config
import { Notify_config, Api_config } from '../../config';

// models
import { Producer } from '../../models/producer';
import { ResponseApi } from '../../models/response';
import { Notify } from '../../models/notify';

// services
import { ProducerService } from '../../services/producer.service';
import { NotifyService } from '../../services/notify.service';
import { AuthService } from '../../services/auth.service';

declare let $: any;
@Component({
  selector: 'app-producer',
  templateUrl: './producer.component.html',
  styleUrls: ['./producer.component.css'],
  providers: [
    ProducerService
  ]
})
export class ProducerComponent implements OnInit, OnDestroy {
  producers = new Array<Producer>();
  newProducer = new Producer();
  filesToReadyUpload = [];

  isEdit = false;
  apiUrl: string = Api_config.rootUrl;
  loadContent = false;
  isLoad = false;

  getAllConnection: any;
  addConnection: any;
  updateConnection: any;
  removeConnection: any;

  constructor(
    private producerService: ProducerService,
    private notifyService: NotifyService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.getAll();
    this.loadContent = true;
  }

  getAll() {
    this.getAllConnection = this.producerService.getAll().subscribe(
      (response: ResponseApi) => {
        console.log(response);
        if (response.success) {
          this.producers = response.data.data.producers;
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }
  add(producer: Producer) {
    this.showLoader(true);
    console.dir(producer);

    const files = new Array<File>();
    this.filesToReadyUpload.forEach((fileObject) => {
      files.push(fileObject.file);
    });

    if (!producer || !producer.name) {
      return this.showMessageForUser(Notify_config.typeMessage.danger, 'Введите наименование категории');
    }


    this.addConnection = this.producerService.add(files, producer).subscribe(
      (response: ResponseApi) => {
        console.log(response);
        if (!response.success) {
          return this.showMessageForUser(Notify_config.typeMessage.danger, response.message);
        }
        const newProducer: Producer = response.data.data.producer;
        this.producers.push(newProducer);

        this.showMessageForUser(Notify_config.typeMessage.success, 'Добавлено');
        this.newProducer = new Producer();

        $('#modal').modal('toggle');
        this.showLoader(false);
      },
      (err) => {
        console.log(err);
        this.showMessageForUser(Notify_config.typeMessage.danger, 'Что то пошло не так');
        this.showLoader(false);
      }
    );
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

  update(producer: Producer) {
    const files = new Array<File>();
    console.log(producer);
    this.showLoader(true);
    this.filesToReadyUpload.forEach((fileObject) => {
      files.push(fileObject.file);
    });

    if (!producer || !producer.name) {
      return this.showMessageForUser(Notify_config.typeMessage.danger, 'Введите наименование категории');
    }

    this.updateConnection = this.producerService.update(files, producer).subscribe(
      (response: ResponseApi) => {
        console.log(response);
        if (!response.success) {
          return this.showMessageForUser(Notify_config.typeMessage.danger, response.message);
        }
        const updateProducer: Producer = response.data.data.producer;
        if (updateProducer) {
          producer.images = updateProducer.images;
        }
        this.newProducer = new Producer();
        this.showMessageForUser(Notify_config.typeMessage.success, response.message);
        this.clearFilesToReadUpload();
        $('#modal').modal('toggle');
        this.showLoader(false);
      },
      (err) => {
        console.log(err);
        this.showMessageForUser(Notify_config.typeMessage.warning, 'Что то пошло не так');
        this.showLoader(false);
      }
    );
  }

  remove(_id: string) {
    this.showLoader(true);
    this.removeConnection = this.producerService.remove(_id).subscribe(
      (response: ResponseApi) => {
        console.log(response);
        if (!response.success) {
          this.showMessageForUser(Notify_config.typeMessage.danger, response.message);
          return;
        }
        this.removeInListProducers(response.data.data.producer);
        this.showMessageForUser(Notify_config.typeMessage.success, response.message);
        this.showLoader(false);
      },
      (err) => {
        console.log(err);
        this.showMessageForUser(Notify_config.typeMessage.danger, 'Что то пошло не так');
        this.showLoader(false);
      }
    );
  }

  clearFilesToReadUpload() {
    this.filesToReadyUpload = [];
  }

  removeInListReadyUpload(fileName: string) {
    this.filesToReadyUpload = this.filesToReadyUpload.filter(x => x.name !== fileName);
  }

  showMessageForUser(typeMessage: string, text: string) {
    const notify = new Notify();
    notify.type = typeMessage;
    notify.text = text;
    this.notifyService.addNotify(notify);
  }

  removeInListProducers(producer: Producer) {
    if (producer && producer._id) {
      this.producers = this.producers.filter(x => x._id !== producer._id);
    }
  }

  removeInProducerImages(producer: Producer, url: string) {
    if (producer && producer.images && producer.images.length > 0 && url) {
      producer.images = producer.images.filter(x => x !== url);
    }
  }

  changeEditStatus(status: boolean) {
    this.isEdit = status;
  }

  clearNewProducer() {
    this.newProducer = new Producer();
  }

  showLoader(status: boolean) {
    this.isLoad = status;
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
    if (this.removeConnection && this.removeConnection.unsubscribe) {
      this.removeConnection.unsubscribe();
    }
  }

}
