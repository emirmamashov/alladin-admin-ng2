import { Component, OnInit, OnDestroy } from '@angular/core';

// config
import { Notify_config } from '../../config';

// modules
import { Producer } from '../../models/producer';
import { Notify } from '../../models/notify';

// services
import { ProducerService } from '../../services/producer.service';

@Component({
  selector: 'app-producer',
  templateUrl: './producer.component.html',
  styleUrls: ['./producer.component.css']
})
export class ProducerComponent implements OnInit, OnDestroy {

  constructor() { }

  ngOnInit() {
  }

  ngOnDestroy() {
    
  }

}
