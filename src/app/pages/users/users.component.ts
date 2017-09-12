import { Component, OnInit, OnDestroy } from '@angular/core';

// config
import { Notify_config, Api_config } from '../../config';

// models
import { User } from '../../models/user';
import { ResponseApi } from '../../models/response';
import { Notify } from '../../models/notify';

// services
import { UsersService } from '../../services/users.service';
import { NotifyService } from '../../services/notify.service';
import { AuthService } from '../../services/auth.service';
import { UnsubscribeService } from '../../services/unsubscribe.service';

declare let $: any;
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  providers: [
    UsersService
  ]
})
export class UsersComponent implements OnInit, OnDestroy {
  users = new Array<User>();
  newUser = new User();

  isEdit = false;
  apiUrl: string = Api_config.rootUrl;
  loadContent = false;
  isLoad = false;

  private subscribes = new Array<any>();

  constructor(
    private usersService: UsersService,
    private notifyService: NotifyService,
    private authService: AuthService,
    private unsubscribeService: UnsubscribeService
  ) { }

  ngOnInit() {
    if (!this.authService.isCheckAuthRedirectToLogin()) {
      this.getAll();
      this.loadContent = true;
    }
  }

  getAll() {
    this.showLoader(true);
    this.subscribes.push(
      this.usersService.getAll().subscribe(
        (response: ResponseApi) => {
          console.log(response);
          if (response.success) {
            this.users = response.data.data.users;
          }
          this.showLoader(false);
        },
        (err) => {
          console.log(err);
          this.showLoader(false);
        }
      )
    );
  }
  add(user: User) {
    this.showLoader(true);
    console.dir(user);

    if (!user || !user.first_name) {
      return this.showMessageForUser(Notify_config.typeMessage.danger, 'Введите Имя');
    }

    this.subscribes.push(
      this.usersService.add(user).subscribe(
        (response: ResponseApi) => {
          console.log(response);
          this.showLoader(false);
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
          const newUser: User = response.data.data.user;
          this.users.push(newUser);

          this.showMessageForUser(Notify_config.typeMessage.success, 'Добавлено');
          this.newUser = new User();

          $('#modal').modal('toggle');
        },
        (err) => {
          console.log(err);
          this.showMessageForUser(Notify_config.typeMessage.danger, 'Что то пошло не так');
          this.showLoader(false);
        }
      )
    );
  }

  update(user: User) {
    console.log(user);
    this.showLoader(true);
    if (!user || !user.first_name) {
      return this.showMessageForUser(Notify_config.typeMessage.danger, 'Введите имя');
    }

    this.subscribes.push(
      this.usersService.update(user).subscribe(
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
          const updateUser: User = response.data.data.user;
          this.newUser = new User();

          this.showMessageForUser(Notify_config.typeMessage.success, response.message);
          $('#modal').modal('toggle');
        },
        (err) => {
          console.log(err);
          this.showMessageForUser(Notify_config.typeMessage.warning, 'Что то пошло не так');
          this.showLoader(false);
        }
      )
    );
  }

  remove(_id: string) {
    this.showLoader(true);
    this.subscribes.push(
      this.usersService.remove(_id).subscribe(
        (response: ResponseApi) => {
          this.showLoader(false);
          console.log(response);
          if (!response.success) {
            this.showMessageForUser(Notify_config.typeMessage.danger, response.message);
            return;
          }
          this.removeInListUsers(response.data.data.user);
          this.showMessageForUser(Notify_config.typeMessage.success, response.message);
        },
        (err) => {
          console.log(err);
          this.showMessageForUser(Notify_config.typeMessage.danger, 'Что то пошло не так');
          this.showLoader(false);
        }
      )
    );
  }

  showMessageForUser(typeMessage: string, text: string) {
    const notify = new Notify();
    notify.type = typeMessage;
    notify.text = text;
    this.notifyService.addNotify(notify);
  }

  removeInListUsers(user: User) {
    if (user && user._id) {
      this.users = this.users.filter(x => x._id !== user._id);
    }
  }

  clearNewUser() {
    this.newUser = new User();
  }

  changeEditStatus(status: boolean) {
    this.isEdit = status;
  }

  showLoader(status: boolean) {
    this.isLoad = status;
  }
  ngOnDestroy() {
    this.unsubscribeService.unsubscribings(this.subscribes);
  }

}
