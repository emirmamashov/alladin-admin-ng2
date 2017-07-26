import { Component, OnInit, OnDestroy } from '@angular/core';

// config
import { Notify_config, Api_config, LimitCategoriesViewInMenu } from '../../config';

// models
import { Category } from '../../models/category';
import { ResponseApi } from '../../models/response';
import { Notify } from '../../models/notify';
import { SelectItem } from 'primeng/primeng';

// services
import { CategoryService } from '../../services/category.service';
import { NotifyService } from '../../services/notify.service';

declare let $: any;
@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
  providers: [
    CategoryService
  ]
})
export class CategoryComponent implements OnInit, OnDestroy {
  categories = new Array<Category>();
  newCategory = new Category();
  categoriesItem: SelectItem[] = [];
  filesToReadyUpload = new Array<any>();

  isEdit = false;
  isLimitCategoriesViewInMenu = false;
  apiUrl: string = Api_config.rootUrl;

  getAllConnection: any;
  addConnection: any;
  updateConnection: any;
  getAllPhotosConnection: any;
  getAllBannersConnection: any;
  removeConnection: any;

  constructor(
    private categoryService: CategoryService,
    private notifyService: NotifyService
  ) { }

  ngOnInit() {
    this.categoriesItem.push({ label: 'Выбрите категорию', value: '' });
    this.getAll();
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

  setCategoriesItem(categories: Array<Category>) {
    categories.forEach((category) => {
      this.categoriesItem.push({ label: category.name, value: category._id });
    });
  }

  add(category: Category) {
    const files = new Array<File>();
    this.filesToReadyUpload.forEach((fileObject) => {
      files.push(fileObject.file);
    });

    if (!category || !category.name) {
      return this.showMessageForUser(Notify_config.typeMessage.danger, 'Введите наименование категории');
    }

    this.addConnection = this.categoryService.add(files, category).subscribe(
      (response: ResponseApi) => {
        console.log(response);
        if (!response.success) {
          return this.showMessageForUser(Notify_config.typeMessage.danger, response.message);
        }
        const newCategory: Category = response.data.data.category;
        this.categories.push(newCategory);
        this.categoriesItem.push({ label: newCategory.name, value: newCategory._id });

        this.showMessageForUser(Notify_config.typeMessage.success, 'Добавлено!');
        this.newCategory = new Category();
        this.clearFilesToReadUpload();

        $('#modal').modal('toggle');
      },
      (err) => {
        console.log(err);
        this.showMessageForUser(Notify_config.typeMessage.danger, 'Что пошло не так!');
      }
    );
  }

  update(category: Category) {
    const files = new Array<File>();
    console.log(category);
    this.filesToReadyUpload.forEach((fileObject) => {
      files.push(fileObject.file);
    });

    if (!category || !category.name) {
      return this.showMessageForUser(Notify_config.typeMessage.danger, 'Введите наименование категории');
    }

    this.updateConnection = this.categoryService.update(files, category).subscribe(
      (response: ResponseApi) => {
        console.log(response);
        if (!response.success) {
          return this.showMessageForUser(Notify_config.typeMessage.danger, response.message);
        }
        this.checkToLimitCategoriesViewInMenu(this.categories);
        const updateCategory: Category = response.data.data.category;
        if (updateCategory) {
          category.images = updateCategory.images;
          this.newCategory.images = updateCategory.images;
        }
        this.newCategory = new Category();
        this.showMessageForUser(Notify_config.typeMessage.success, response.message);
        this.clearFilesToReadUpload();
        $('#modal').modal('toggle');
      },
      (err) => {
        console.log(err);
        this.showMessageForUser(Notify_config.typeMessage.warning, 'Что то пошло не так');
      }
    );
  }

  clearFilesToReadUpload() {
    this.filesToReadyUpload = [];
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

  remove(_id: string) {
    this.removeConnection = this.categoryService.remove(_id).subscribe(
      (response: ResponseApi) => {
        console.log(response);
        if (!response.success) {
          this.showMessageForUser(Notify_config.typeMessage.danger, response.message);
          return;
        }
        this.removeInListCategories(response.data.data.category);
        this.showMessageForUser(Notify_config.typeMessage.success, response.message);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  removeInListCategories(category: Category) {
    if (category && category._id) {
      this.categories = this.categories.filter(x => x._id !== category._id);
    }
  }

  removeInCategoryImages(category: Category, url: string) {
    if (category && category.images && category.images.length > 0 && url) {
      category.images = category.images.filter(x => x !== url);
    }
  }

   showMessageForUser(typeMessage: string, text: string) {
    const notify = new Notify();
    notify.type = typeMessage;
    notify.text = text;
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
    if (this.removeConnection && this.removeConnection.unsubscribe) {
      this.removeConnection.unsubscribe();
    }
  }

}
