// core
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

// config
import { Notify_config } from '../../../config';

// models
import { ResponseApi } from '../../../models/response';
import { Notify } from '../../../models/notify';

// services
import { AuthService } from '../../../services/auth.service';
import { NotifyService } from '../../../services/notify.service';
import { MyLocalStorageService } from '../../../services/local-storage.service';
import { UnsubscribeService } from '../../../services/unsubscribe.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  loadContent = false;
  subscribes = new Array<any>();

  constructor(
    private authService: AuthService,
    private notifySerivce: NotifyService,
    private localStorage: MyLocalStorageService,
    private router: Router,
    private unsubscribeService: UnsubscribeService
  ) { }

  ngOnInit() {
    if (!this.authService.isCheckAuthRedirectToProfile()) {
      console.log('----isCheckAuthRedirectToProfile-----');
      this.loadContent = true;
    }
  }

  doLogin(email: string, password: string) {
    this.subscribes.push(
      this.authService.login(email, password).subscribe(
      (response: ResponseApi) => {
          console.log(response);
          if (!response.success) {
            const validates: Array<string> = response.message.validates || [];
            console.log(validates);
            if (validates.length > 0) {
              let text = '';
              validates.forEach((message) => {
                text += message + '<br/>';
              });
              return this.showError(Notify_config.typeMessage.danger, text);
            }
            return this.showError(Notify_config.typeMessage.danger,  response.message);
          }
          this.localStorage.setToken(response.data.data.token);
          this.localStorage.setUser(response.data.data.user);
          this.router.navigate(['/products']);
        },
        (err) => {
          console.log(err);
        }
      )
    );
  }

  doForgotPassword() {
    this.showError(Notify_config.typeMessage.info, 'Обратитесь к администратору, напишите на почту emir.mamashov@gmail.com');
  }

  showError(type: string, message: string) {
    const notify = new Notify();
    notify.text = message;
    notify.type = type || Notify_config.typeMessage.danger;
    this.notifySerivce.addNotify(notify);
  }

  ngOnDestroy() {
    this.unsubscribeService.unsubscribings(this.subscribes);
  }

}
