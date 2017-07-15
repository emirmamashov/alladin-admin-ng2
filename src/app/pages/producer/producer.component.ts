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

  isEdit = false;
  apiUrl: string = Api_config.rootUrl;

  getAllConnection: any;
  addConnection: any;

  constructor(
    private producerService: ProducerService,
    private notifyService: NotifyService
  ) { }

  ngOnInit() {
    this.getAll();
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
  add(category: Producer) {
    console.dir(category);
    const notify = new Notify();
    notify.type = Notify_config.typeMessage.danger;
    notify.text = 'Что то пошло не так!';

    this.addConnection = this.producerService.add(category).subscribe(
      (response: ResponseApi) => {
        console.log(response);
        if (!response.success) {
          notify.text = response.message;
          return this.notifyService.addNotify(notify);
        }
        const newProducer: Producer = response.data.data.producer;
        this.producers.push(newProducer);

        notify.type = Notify_config.typeMessage.success;
        notify.text = 'Добавлено!';
        this.notifyService.addNotify(notify);
        this.newProducer = new Producer();

        $('#modal').modal('toggle');
      },
      (err) => {
        console.log(err);
        this.notifyService.addNotify(notify);
      }
    );
  }

  ngOnDestroy() {
    if (this.getAllConnection && this.getAllConnection.unsubscribe) {
      this.getAllConnection.unsubscribe();
    }
    if (this.addConnection && this.addConnection.unsubscribe) {
      this.addConnection.unsubscribe();
    }
  }

}
