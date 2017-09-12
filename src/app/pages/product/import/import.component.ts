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
import { AuthService } from '../../../services/auth.service';
import { UnsubscribeService } from '../../../services/unsubscribe.service';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.css'],
  providers: [ ExelService ]
})
export class ImportComponent implements OnInit, OnDestroy {
  loadContent = false;
  private subscribes = new Array<any>();

  constructor(
    private exelService: ExelService,
    private notifyService: NotifyService,
    private router: Router,
    private authService: AuthService,
    private unsubscribeService: UnsubscribeService
  ) { }

  ngOnInit() {
    if (!this.authService.isCheckAuthRedirectToLogin()) {
      this.loadContent = true;
    }
  }

  import(file: any) {
    console.dir(file);
    const notify = new Notify();
    notify.type = Notify_config.typeMessage.danger;
    notify.text = 'Что то пошло не так!';

    this.subscribes.push(
      this.exelService.import(file.files).subscribe(
        (response: ResponseApi) => {
          console.log(response);
          if (response.success) {
            let errorMsg = 'нет';
            const import_failed_products = response.data.data.import_failed_products || [];
            import_failed_products.forEach((importProduct) => {
              errorMsg += '\n' + importProduct.error;
            });
            notify.type = Notify_config.typeMessage.success;
            notify.text = 'Операция зынк өттү!\n Импортировано: ' + response.data.data.import_products_count + ';' +
            '\nПровалено: ' + response.data.data.import_failed_products.length +
            '\nОшибки: ' + errorMsg;
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
      )
    );
  }

  ngOnDestroy() {
    this.unsubscribeService.unsubscribings(this.subscribes);
  }

}
