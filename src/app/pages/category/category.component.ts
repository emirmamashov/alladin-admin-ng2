import { Component, OnInit, OnDestroy } from '@angular/core';

// config
import { Notify_config, Api_config, LimitCategoriesViewInMenu } from '../../config';

// models
import { Category } from '../../models/category';
import { Photo } from '../../models/photo';
import { ResponseApi } from '../../models/response';
import { Notify } from '../../models/notify';
import { SelectItem } from 'primeng/primeng';
import { Banner } from '../../models/banner';

// services
import { CategoryService } from '../../services/category.service';
import { NotifyService } from '../../services/notify.service';
import { PhotoService } from '../../services/photo.service';
import { BannerService } from '../../services/banner.service';

declare let $: any;
@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
  providers: [
    CategoryService,
    PhotoService,
    BannerService
  ]
})
export class CategoryComponent implements OnInit, OnDestroy {
  categories = new Array<Category>();
  newCategory = new Category();
  photos = new Array<Photo>();
  banners = new Array<Banner>();
  categoriesItem: SelectItem[] = [];
  photosSelectItems: SelectItem[] = [];
  bannersSelectItems: SelectItem[] = [];

  isEdit = false;
  isLimitCategoriesViewInMenu = false;
  apiUrl: string = Api_config.rootUrl;

  getAllConnection: any;
  addConnection: any;
  updateConnection: any;
  getAllPhotosConnection: any;
  getAllBannersConnection: any;

  constructor(
    private categoryService: CategoryService,
    private notifyService: NotifyService,
    private photoService: PhotoService,
    private bannerService: BannerService
  ) { }

  ngOnInit() {
    this.categoriesItem.push({ label: 'Выбрите категорию', value: '' });
    this.getAll();
    this.getAllPhotos();
    this.getAllBanners();
  }

  getAll() {
    this.getAllConnection = this.categoryService.getAll().subscribe(
      (response: ResponseApi) => {
        console.log(response);
        if (response.success) {
          this.categories = response.data.data.categories;
          this.setCategoriesItem(this.categories);
          this.checkToLimitCategoriesViewInMenu(this.categories);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

 getAllPhotos() {
    this.getAllPhotosConnection = this.photoService.getAll().subscribe(
      (response: ResponseApi) => {
        console.log(response);
        if (response.success) {
          this.photos = response.data.data.photos;
          this.setPhotosItem(this.photos);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }
  getAllBanners() {
    this.getAllBannersConnection = this.bannerService.getAll().subscribe(
      (response: ResponseApi) => {
        console.log(response);
        if (response.success) {
          this.banners = response.data.data.banners;
          this.setBannersItem(this.banners);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  setCategoriesItem(categories: Array<Category>) {
    categories.forEach((category) => {
      this.categoriesItem.push({ label: category.name, value: category._id });
    });
  }

  setPhotosItem(photos: Array<Photo>) {
    photos.forEach((photo) => {
      this.photosSelectItems.push({ label: photo.name, value: {id: photo._id, url: Api_config.rootUrl + '/' + photo.url }});
    });
  }

  setBannersItem(banners: Array<Banner>) {
    banners.forEach((banner) => {
      this.bannersSelectItems.push({ label: banner.name, value: {id: banner._id, url: Api_config.rootUrl + '/' + banner.photo.url || '' }});
    });
  }

  add(category: Category) {
    console.dir(category);

    const notify = new Notify();
    notify.type = Notify_config.typeMessage.danger;
    notify.text = 'Что то пошло не так!';

    if (category.photo) {
      category.photo = category.photo.id;
    }
    if (category.banner) {
      category.banner = category.banner.id;
    }

    this.addConnection = this.categoryService.add(category).subscribe(
      (response: ResponseApi) => {
        console.log(response);
        if (!response.success) {
          notify.text = response.message;
          return this.notifyService.addNotify(notify);
        }
        const newCategory: Category = response.data.data.category;
        this.categories.push(newCategory);
        this.categoriesItem.push({ label: newCategory.name, value: newCategory._id });

        notify.type = Notify_config.typeMessage.success;
        notify.text = 'Добавлено!';
        this.notifyService.addNotify(notify);
        this.newCategory = new Category();

        $('#modal').modal('toggle');
      },
      (err) => {
        console.log(err);
        this.notifyService.addNotify(notify);
      }
    );
  }

  update(category: Category) {

    const notify = new Notify();
    notify.type = Notify_config.typeMessage.danger;
    notify.text = 'Что то пошло не так!';

    if (category.photo) {
      category.photo = category.photo.id;
    }
    if (category.banner) {
      category.banner = category.banner.id;
    }

    this.updateConnection = this.categoryService.update(category).subscribe(
      (response: ResponseApi) => {
        console.log(response);
        if (!response.success) {
          notify.text = response.message;
          return this.notifyService.addNotify(notify);
        }
        this.checkToLimitCategoriesViewInMenu(this.categories);
        notify.type = Notify_config.typeMessage.success;
        notify.text = 'Обнавлено!';
        this.notifyService.addNotify(notify);
        this.newCategory = new Category();

        $('#modal').modal('toggle');
      },
      (err) => {
        console.log(err);
        this.notifyService.addNotify(notify);
      }
    );
  }

  checkToLimitCategoriesViewInMenu(categories: Array<Category>) {
      if (categories.filter(x => x.viewInMenu).length >= LimitCategoriesViewInMenu) {
        this.isLimitCategoriesViewInMenu = true;
      } else {
        this.isLimitCategoriesViewInMenu = false;
      }
  }

  changeEditStatus(status: boolean) {
    this.isEdit = status;
  }

  doLimitCategoriesViewInMenu() {
    const notify = new Notify();
    notify.type = Notify_config.typeMessage.warning;
    notify.text = 'Только ' + LimitCategoriesViewInMenu +
    ' категории можно отображат в меню, вы уже выбрали эти ' + LimitCategoriesViewInMenu + ':)';
    this.notifyService.addNotify(notify);
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
    if (this.getAllPhotosConnection && this.getAllPhotosConnection.unsubscribe) {
      this.getAllPhotosConnection.unsubscribe();
    }
  }

}
