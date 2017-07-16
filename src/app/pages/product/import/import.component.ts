import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

// config
import { Notify_config } from '../../../config';

// models
import { ResponseApi } from '../../../models/response';
import { Notify } from '../../../models/notify';

// services
import { ExelService } from '../../../services/exel.service';
import { NotifyService } from '../../../services/notify.service';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.css'],
  providers: [ExelService]
})
export class ImportComponent implements OnInit, OnDestroy {
  private importConnection: any;
  constructor(
    private exelService: ExelService,
    private notifyService: NotifyService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  import(file: any) {
    console.dir(file);
    const notify = new Notify();
    notify.type = Notify_config.typeMessage.danger;
    notify.text = 'Что то пошло не так!';

    this.importConnection = this.exelService.import(file.files).subscribe(
      (response: ResponseApi) => {
        console.log(response);
        if (response.success) {
          const import_failed_products = response.data.data.import_failed_products || [];
          notify.type = Notify_config.typeMessage.success;
          notify.text = 'Операция зынк өттү!\n Импортировано: ' + response.data.data.import_products_count + ';' +
          '\nПровалено: ' + response.data.data.import_failed_products.length;
          notify.delay = 10000;
          this.notifyService.addNotify(notify);
          this.router.navigate(['/products']);
        } else {
          notify.text = response.message;
          this.notifyService.addNotify(notify);
        }
      },
      (err) => {
        console.log(err);
        this.notifyService.addNotify(notify);
      }
    );
  }

  ngOnDestroy() {
    if (this.importConnection && this.importConnection.unsubscribe) {
      this.importConnection.unsubscribe();
    }
  }

}