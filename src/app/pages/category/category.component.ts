import { Component, OnInit, OnDestroy } from '@angular/core';

// config
import { Notify_config, Api_config, LimitCategoriesViewInMenu, PageLimit } from '../../config';

// models
import { Category } from '../../models/category';
import { ResponseApi } from '../../models/response';
import { Notify } from '../../models/notify';
import { SelectItem } from 'primeng/primeng';
import { Paginator } from '../../models/paginator';

// services
import { CategoryService } from '../../services/category.service';
import { NotifyService } from '../../services/notify.service';
import { AuthService } from '../../services/auth.service';
import { UnsubscribeService } from '../../services/unsubscribe.service';

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
  allCategories = new Array<Category>();
  newCategory = new Category();

  categoriesItem: SelectItem[] = [];
  filesToReadyUpload = new Array<any>();
  subscribes = new Array<any>();

  isEdit = false;
  isLimitCategoriesViewInMenu = false;
  apiUrl: string = Api_config.rootUrl;
  loadContent = false;
  optionsShowInMainPageLeft = true;
  oprtionsShowInMainPageRight = true;
  isLoad = false;

  // pagination
  currentPage = 1;
  limit = PageLimit;
  countAllPage = 0;
  pages = new Array<Paginator>();
  searchText: string;

  constructor(
    private categoryService: CategoryService,
    private notifyService: NotifyService,
    private authService: AuthService,
    private unsubscribeService: UnsubscribeService
  ) { }

  ngOnInit() {
    if (!this.authService.isCheckAuthRedirectToLogin()) {
      this.categoriesItem.push({ label: 'Выбрите категорию', value: '' });
      this.getAll(1, '');
      this.getAllWithoutPaginator();
      this.loadContent = true;
    }
  }

  showLoader(status: boolean) {
    this.isLoad = status;
  }
  getAll(page: number, searchText: string) {
    this.showLoader(true);
    this.currentPage = page;

    this.subscribes.push(
      this.categoryService.getAll(page, this.limit, searchText || '').subscribe(
        (response: ResponseApi) => {
          console.log(response);
          this.showLoader(false);
          if (response.success) {
            this.categories = response.data.data.categories;
            const count = response.data.data.count;
            this.initPaginator(this.currentPage, count);
            this.setParentCategoriesModel(this.allCategories);
          }
        },
        (err) => {
          this.showLoader(false);
          console.log(err);
        }
      )
    );
  }

  getAllWithoutPaginator() {
    this.showLoader(true);
    this.subscribes.push(
      this.categoryService.getAll(1, null, '').subscribe(
        (response: ResponseApi) => {
          console.log(response);
          this.showLoader(false);
          if (response.success) {
            this.allCategories = response.data.data.categories;
            this.setCategoriesItem();
            this.checkToLimitCategoriesViewInMenu(response.data.data.categories);
            this.setParentCategoriesModel(response.data.data.categories);
            this.checkOptionsLeftRigthShowCategories(response.data.data.categories);
          }
        },
        (err) => {
          this.showLoader(false);
          console.log(err);
        }
      )
    );
  }


  initPaginator(page: number, count: number) {
    const pages = Math.ceil(count / this.limit);
    this.pages = [];
    console.log(page, this.limit, count, pages);
    if (pages < 1) {
      this.currentPage = 1;
      this.countAllPage = 1;
      const paginator = new Paginator();
      paginator.pageNumber = 1;
      paginator.isCurrent = true;
      this.pages.push(paginator);
      console.log(this.pages);
      return;
    }
    this.countAllPage = pages;
    this.currentPage = page;
    if (this.countAllPage > 5) {
      let maxPage = this.currentPage + 4;
      if (maxPage > this.countAllPage) {
        maxPage = this.countAllPage;
      }

      for (let i = this.currentPage; i <= maxPage; i++) {
        const paginator = new Paginator();
        paginator.pageNumber = i;
        if (i === this.currentPage) {
          paginator.isCurrent = true;
        }
        this.pages.push(paginator);
      }
      return;
    }
    for (let i = 1; i <= pages; i++) {
      const paginator = new Paginator();
      paginator.pageNumber = i;
      if (i === this.currentPage) {
        paginator.isCurrent = true;
      }
      this.pages.push(paginator);
    }
  }

  setParentCategoriesModel(allCategories: Array<Category>) {
    this.categories.forEach((category) => {
      category.parentCategoryModel = allCategories.filter(x => x._id === category.parentCategory)[0] || new Category();
    });
  }

  setCategoriesItem() {
    const parentCategories = this.allCategories.filter(x => !x.parentCategory);
    if (parentCategories.length === 0) {
      return;
    }
    parentCategories.forEach((category) => {
      const firstChildrenCategories = this.knowedChildrenCategories([category]);

      const secondChildrenCategories = this.knowedChildrenCategories(firstChildrenCategories);

      const threeChildrenCategories = this.knowedChildrenCategories(secondChildrenCategories);

      this.categoriesItem.push({ label: category.name, value: category._id });

      if (firstChildrenCategories && firstChildrenCategories.length > 0) {
        firstChildrenCategories.forEach((firstCategory) => {
          this.categoriesItem.push({ label: '-' + firstCategory.name, value: firstCategory._id });
        });

        if (secondChildrenCategories && secondChildrenCategories.length > 0) {
          secondChildrenCategories.forEach((secondCategory) => {
            this.categoriesItem.push({ label: '-' + secondCategory.name, value: secondCategory._id });
          });
          if (threeChildrenCategories && threeChildrenCategories.length > 0) {
            threeChildrenCategories.forEach((threeCategory) => {
              this.categoriesItem.push({ label: '-' + threeCategory.name, value: threeCategory._id });
            });
          }
        }
      }
    });
  }

  knowedChildrenCategories(categories: Array<Category>) {
    if (!categories || categories.length === 0) {
      return [];
    }
    const resultCategories = new Array<Category>();
    categories.forEach((category) => {
      const findCategories = this.allCategories.filter(x => x.parentCategory === category._id);
      if (findCategories && findCategories.length > 0) {
        findCategories.forEach((findCategory) => {
          resultCategories.push(findCategory);
        });
      }
    });
    return resultCategories;
  }

  add(category: Category) {
    this.showLoader(true);
    const files = new Array<File>();
    if (this.filesToReadyUpload && this.filesToReadyUpload.length > 0) {
        this.filesToReadyUpload.forEach((fileObject) => {
        files.push(fileObject.file);
      });
    }
    if (!category || !category.name) {
      return this.showMessageForUser(Notify_config.typeMessage.danger, 'Введите наименование категории');
    }

    this.subscribes.push(
      this.categoryService.add(files, category).subscribe(
      (response: ResponseApi) => {
          console.log(response);
          this.showLoader(false);
          if (!response.success) {
            return this.showMessageForUser(Notify_config.typeMessage.danger, response.message);
          }
          const newCategory: Category = response.data.data.category;
          newCategory.parentCategoryModel = this.categories.filter(x => x._id === newCategory.parentCategory)[0] || new Category();
          this.categories.push(newCategory);
          this.categoriesItem.push({ label: newCategory.name, value: newCategory._id });

          this.showMessageForUser(Notify_config.typeMessage.success, 'Добавлено!');
          this.newCategory = new Category();
          this.clearFilesToReadUpload();

          this.setCategoriesItem();

          $('#modal').modal('toggle');
          this.checkOptionsLeftRigthShowCategories(this.categories);
        },
        (err) => {
          this.showLoader(false);
          console.log(err);
          this.showMessageForUser(Notify_config.typeMessage.danger, 'Что пошло не так!');
        }
      )
    );
  }

  update(category: Category) {
    this.showLoader(true);
    const files = new Array<File>();
    console.log(category);
    if (this.filesToReadyUpload && this.filesToReadyUpload.length > 0) {
      this.filesToReadyUpload.forEach((fileObject) => {
        files.push(fileObject.file);
      });
    }

    if (!category || !category.name) {
      return this.showMessageForUser(Notify_config.typeMessage.danger, 'Введите наименование категории');
    }

    this.subscribes.push(
      this.categoryService.update(files, category).subscribe(
      (response: ResponseApi) => {
          this.showLoader(false);
          console.log(response);
          if (!response.success) {
            return this.showMessageForUser(Notify_config.typeMessage.danger, response.message);
          }
          this.checkToLimitCategoriesViewInMenu(this.categories);
          const updateCategory: Category = response.data.data.category;
          if (updateCategory) {
            category.images = updateCategory.images;
            category.parentCategoryModel = this.categories.filter(x => x._id === updateCategory.parentCategory)[0] || new Category();
          }
          this.newCategory = new Category();
          this.showMessageForUser(Notify_config.typeMessage.success, response.message);
          this.clearFilesToReadUpload();

          this.setCategoriesItem();
          $('#modal').modal('toggle');

          this.checkOptionsLeftRigthShowCategories(this.categories);
        },
        (err) => {
          this.showLoader(false);
          console.log(err);
          this.showMessageForUser(Notify_config.typeMessage.warning, 'Что то пошло не так');
        }
      )
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
  checkOptionsLeftRigthShowCategories(categories: Array<Category>) {
    this.optionsShowInMainPageLeft = categories.filter(x => x.showInMainPageLeft).length >= 4 ? false : true;
    this.oprtionsShowInMainPageRight = categories.filter(x => x.showInMainPageRight).length >= 4 ? false : true;
  }
  remove(_id: string) {
    this.showLoader(true);
    this.subscribes.push(
      this.categoryService.remove(_id).subscribe(
        (response: ResponseApi) => {
          this.showLoader(false);
          console.log(response);
          if (!response.success) {
            this.showMessageForUser(Notify_config.typeMessage.danger, response.message);
            return;
          }
          this.removeInListCategories(response.data.data.category);
          this.showMessageForUser(Notify_config.typeMessage.success, response.message);

          this.setCategoriesItem();
        },
        (err) => {
          this.showLoader(false);
          console.log(err);
        }
      )
    );
  }

  removeInListCategories(category: Category) {
    if (category && category._id) {
      this.categories = this.categories.filter(x => x._id !== category._id);
      this.categoriesItem = this.categoriesItem.filter(x => x.value !== category._id);
    }
  }

  removeInCategoryImages(category: Category, url: string) {
    if (category && category.images && category.images.length > 0 && url) {
      category.images = category.images.filter(x => x !== url);
    }
  }

  clearNewCategory() {
    this.newCategory = new Category();
  }

   showMessageForUser(typeMessage: string, text: string) {
    const notify = new Notify();
    notify.type = typeMessage;
    notify.text = text;
    this.notifyService.addNotify(notify);
  }

  searchCategory(text: string) {
    console.log(text);
    if (!text) {
      return this.getAll(1, '');
    }
    this.getAll(1, text);
  }

  ngOnDestroy() {
    this.unsubscribeService.unsubscribings(this.subscribes);
  }

}
