// core
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

// config
import { Notify_config } from '../../config';

// models
import { Exchange } from '../../models/exchange';
import { ResponseApi } from '../../models/response';
import { Notify } from '../../models/notify';

// services
import { ExchangeService } from '../../services/exchange.service';
import { UnsubscribeService } from '../../services/unsubscribe.service';
import { NotifyService } from '../../services/notify.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-exchange',
  templateUrl: './exchange.component.html',
  styleUrls: ['./exchange.component.css'],
  providers: [ ExchangeService ]
})
export class ExchangeComponent implements OnInit, OnDestroy {
  exchange = new Exchange();
  isLoad = false;
  loadContent = false;

  subscribes = new Array<any>();

  constructor(
    private exchangeService: ExchangeService,
    private unsubscribeService: UnsubscribeService,
    private notifyService: NotifyService,
    private authService: AuthService,
    private router: Router
  ) {

  }

  ngOnInit() {
    this.checkAuth();
  }

  checkAuth() {
    if (!this.authService.isCheckAuthRedirectToLogin()) {
      this.authService.checkAuth().subscribe(
        (response: ResponseApi) => {
          console.log(response);
          if (!response.success) {
            this.authService.logout();
          }

          this.get();
          this.loadContent = true;
        },
        (err: any) => {
          console.log(err);
          this.authService.logout();
        }
      );
    }
  }

  get() {
    this.subscribes.push(
      this.exchangeService.get().subscribe(
        (response: ResponseApi) => {
          console.log(response);
          if (response.success) {
            this.exchange = response.data.data.exchange;
          }
        },
        (err: any) => {
          console.log(err);
        }
      )
    );
  }

  update(exchange: Exchange) {
    console.log(exchange);
    this.showLoader(true);
    if (!exchange) {
      return this.showMessageForUser(Notify_config.typeMessage.danger, 'Введите наименование');
    }

    this.subscribes.push(
      this.exchangeService.update(exchange).subscribe(
      (response: ResponseApi) => {
          this.showLoader(false);
          console.log(response);
          if (!response.success) {
            let messages = response.message;
            const validatesMessages = response.message.validates;
            if (validatesMessages) {
              messages = 'Проблема валидации';
              if (validatesMessages.length > 0) {
                messages = '';
                validatesMessages.forEach((message) => {
                  messages += message + '<br/>';
                });
              }
            }
            return this.showMessageForUser(Notify_config.typeMessage.danger, messages);
          }

          this.showMessageForUser(Notify_config.typeMessage.success, response.message);
        },
        (err) => {
          console.log(err);
          this.showMessageForUser(Notify_config.typeMessage.warning, 'Что то пошло не так');
          this.showLoader(false);
        }
      )
    );
  }


  showLoader(status: boolean) {
    this.isLoad = status;
  }

  showMessageForUser(typeMessage: string, text: string) {
    const notify = new Notify();
    notify.type = typeMessage;
    notify.text = text;
    this.notifyService.addNotify(notify);
  }

  ngOnDestroy() {
    this.unsubscribeService.unsubscribings(this.subscribes);
  }

}
