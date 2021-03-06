import { Component, OnInit, OnDestroy } from '@angular/core';

// config
import { Notify_config, Api_config } from '../../config';

// models
import { Banner } from '../../models/banner';
import { Photo } from '../../models/photo';
import { ResponseApi } from '../../models/response';
import { Notify } from '../../models/notify';
import { SelectItem } from 'primeng/primeng';
import { Category } from '../../models/category';

// services
import { BannerService } from '../../services/banner.service';
import { NotifyService } from '../../services/notify.service';
import { CategoryService } from '../../services/category.service';
import { UnsubscribeService } from '../../services/unsubscribe.service';

declare let $: any;
@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css'],
  providers: [
    BannerService,
    CategoryService
  ]
})
export class BannerComponent implements OnInit, OnDestroy {
  banners = new Array<Banner>();
  newBanner = new Banner();
  filesToReadyUpload = new Array<any>();

  categoriesSelectItems: SelectItem[] = [];
  optionsShowInMainPageLeft = true;
  oprtionsShowInMainPageRight = true;

  isEdit = false;
  apiUrl: string = Api_config.rootUrl;

  subscribes = new Array<any>();

  constructor(
    private bannerService: BannerService,
    private notifyService: NotifyService,
    private categoryService: CategoryService,
    private unsubscribeService: UnsubscribeService
  ) { }

  ngOnInit() {
    this.getAll();
    this.getAllCategroies();
    this.categoriesSelectItems.push({ label: 'Выберите категорию', value: '' });
  }

  getAll() {
    this.subscribes.push(
      this.bannerService.getAll().subscribe(
        (response: ResponseApi) => {
          console.log(response);
          if (response.success) {
            this.banners = response.data.data.banners;
            this.checkOptionsLeftRigthShowBanners(this.banners);
          }
        },
        (err) => {
          console.log(err);
        }
      )
    );
  }
  checkOptionsLeftRigthShowBanners(banners: Array<Banner>) {
    this.optionsShowInMainPageLeft = banners.filter(x => x.showInMainPageLeft)[0] ? false : true;
    this.oprtionsShowInMainPageRight = banners.filter(x => x.showInMainPageRight)[0] ? false : true;
  }

  getAllCategroies() {
    this.subscribes.push(
      this.categoryService.getAll(1, null, '').subscribe(
        (response: ResponseApi) => {
          console.log(response);
          if (response.success) {
            this.setCategoriesSelectItems(response.data.data.categories);
          }
        },
        (err) => {
          console.log(err);
        }
      )
    );
  }

  setCategoriesSelectItems(categories: Array<Category>) {
    if (categories && categories.length > 0) {
      categories.forEach((category) => {
        this.categoriesSelectItems.push({ label: category.name, value: category._id });
      });
    }
  }

  add(banner: Banner) {
    console.dir(banner);

    const notify = new Notify();
    notify.type = Notify_config.typeMessage.danger;
    notify.text = 'Что то пошло не так!';

    const files = new Array<File>();
    this.filesToReadyUpload.forEach((fileObject) => {
      files.push(fileObject.file);
    });

    this.subscribes.push(
      this.bannerService.add(files, banner).subscribe(
        (response: ResponseApi) => {
          console.log(response);
          if (!response.success) {
            notify.text = response.message;
            return this.notifyService.addNotify(notify);
          }
          const newBanner: Banner = response.data.data.banner;
          this.banners.push(newBanner);
          notify.type = Notify_config.typeMessage.success;
          notify.text = 'Добавлено!';
          this.notifyService.addNotify(notify);
          this.newBanner = new Banner();

          $('#modal').modal('toggle');
          this.checkOptionsLeftRigthShowBanners(this.banners);
        },
        (err) => {
          console.log(err);
          this.notifyService.addNotify(notify);
        }
      )
    );
  }

  update(banner: Banner) {
    const files = new Array<File>();
    console.log(banner);
    if (this.filesToReadyUpload && this.filesToReadyUpload.length > 0) {
      this.filesToReadyUpload.forEach((fileObject) => {
        files.push(fileObject.file);
      });
    }

    if (!banner || !banner.name) {
      return this.showMessageForUser(Notify_config.typeMessage.danger, 'Введите наименование');
    }

    this.subscribes.push(
      this.bannerService.update(files, banner).subscribe(
        (response: ResponseApi) => {
          console.log(response);
          if (!response.success) {
            return this.showMessageForUser(Notify_config.typeMessage.danger, response.message);
          }
          const updateBanner: Banner = response.data.data.banner;
          if (updateBanner) {
            banner.images = updateBanner.images;
          }
          this.newBanner = new Banner();
          this.showMessageForUser(Notify_config.typeMessage.success, response.message);
          this.clearFilesToReadUpload();

          $('#modal').modal('toggle');
          this.checkOptionsLeftRigthShowBanners(this.banners);
        },
        (err) => {
          console.log(err);
          this.showMessageForUser(Notify_config.typeMessage.warning, 'Что то пошло не так');
        }
      )
    );
  }

  remove(_id: string) {
    this.subscribes.push(
      this.bannerService.remove(_id).subscribe(
      (response: ResponseApi) => {
          console.log(response);
          if (!response.success) {
            this.showMessageForUser(Notify_config.typeMessage.danger, response.message);
            return;
          }
          this.removeInListBanners(response.data.data.banner);
          this.showMessageForUser(Notify_config.typeMessage.success, response.message);
        },
        (err) => {
          console.log(err);
        }
      )
    );
  }

  removeInListBanners(banner: Banner) {
    if (banner && banner._id) {
      this.banners = this.banners.filter(x => x._id !== banner._id);
    }
  }

  clearNewCategory() {
    this.newBanner = new Banner();
  }

  changeEditStatus(status: boolean) {
    this.isEdit = status;
  }

  clearFilesToReadUpload() {
    this.filesToReadyUpload = [];
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

  removeInListReadyUpload(fileName: string) {
    this.filesToReadyUpload = this.filesToReadyUpload.filter(x => x.name !== fileName);
  }

  clearNewBanner() {
    this.newBanner = new Banner();
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
