import { Component, OnInit, OnDestroy } from '@angular/core';

// config
import { Notify_config, Api_config } from '../../config';

// models
import { Blog } from '../../models/blog';
import { ResponseApi } from '../../models/response';
import { Notify } from '../../models/notify';

// services
import { BlogsService } from '../../services/blogs.service';
import { NotifyService } from '../../services/notify.service';
import { AuthService } from '../../services/auth.service';
import { UnsubscribeService } from '../../services/unsubscribe.service';

declare let $: any;
@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.css'],
  providers: [ BlogsService ]
})
export class BlogsComponent implements OnInit, OnDestroy {
  blogs = new Array<Blog>();
  newBlog = new Blog();

  isEdit = false;
  apiUrl: string = Api_config.rootUrl;
  loadContent = false;
  isLoad = false;

  subscribes = new Array<any>();

  constructor(
    private blogService: BlogsService,
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
      this.blogService.getAll().subscribe(
        (response: ResponseApi) => {
          console.log(response);
          if (response.success) {
            this.blogs = response.data.data.blogs;
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
  add(blog: Blog) {
    this.showLoader(true);
    console.dir(blog);

    if (!blog || !blog.name) {
      return this.showMessageForUser(Notify_config.typeMessage.danger, 'Введите Имя');
    }

    this.subscribes.push(
      this.blogService.add(blog).subscribe(
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
          const newBlog: Blog = response.data.data.blog;
          this.blogs.push(newBlog);

          this.showMessageForUser(Notify_config.typeMessage.success, 'Добавлено');
          this.newBlog = new Blog();

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

  update(blog: Blog) {
    console.log(blog);
    this.showLoader(true);
    if (!blog || !blog.name) {
      return this.showMessageForUser(Notify_config.typeMessage.danger, 'Введите наименование');
    }

    this.subscribes.push(
      this.blogService.update(blog).subscribe(
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
          const updateBlog: Blog = response.data.data.blog;
          this.newBlog = new Blog();

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
      this.blogService.remove(_id).subscribe(
      (response: ResponseApi) => {
          this.showLoader(false);
          console.log(response);
          if (!response.success) {
            this.showMessageForUser(Notify_config.typeMessage.danger, response.message);
            return;
          }
          this.removeInListBlogs(response.data.data.blog);
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

  removeInListBlogs(blog: Blog) {
    if (blog && blog._id) {
      this.blogs = this.blogs.filter(x => x._id !== blog._id);
    }
  }
  showMessageForUser(typeMessage: string, text: string) {
    const notify = new Notify();
    notify.type = typeMessage;
    notify.text = text;
    this.notifyService.addNotify(notify);
  }

  showLoader(status: boolean) {
    this.isLoad = status;
  }

  clearNewBlog() {
    this.newBlog = new Blog();
  }

  changeEditStatus(status: boolean) {
    this.isEdit = status;
  }

  ngOnDestroy() {
    this.unsubscribeService.unsubscribings(this.subscribes);
  }

}
