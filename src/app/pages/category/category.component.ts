import { Component, OnInit, OnDestroy } from '@angular/core';

// config
import { Notify_config } from '../../config';

// models
import { Category } from '../../models/category';
import { ResponseApi } from '../../models/response';
import { Notify } from '../../models/notify';
import { SelectItem } from 'primeng/primeng';

// services
import { CategoryService } from '../../services/category.service';
import { NotifyService } from '../../services/notify.service';

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

  isEdit = false;

  getAllConnection: any;
  addConnection: any;

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
    const notify = new Notify();
    notify.type = Notify_config.typeMessage.danger;
    notify.text = 'Что то пошло не так!';

    this.addConnection = this.categoryService.add(category).subscribe(
      (response: ResponseApi) => {
        console.log(response);
        if (!response.success) {
          notify.text = response.message;
          return this.notifyService.addNotify(notify);
        }
        this.categories.push(response.data.data.category);

        notify.type = Notify_config.typeMessage.success;
        notify.text = 'Добавлено!';
        this.notifyService.addNotify(notify);
      },
      (err) => {
        console.log(err);
        this.notifyService.addNotify(notify);
      }
    );
  }

  ngOnDestroy() {
    if (this.getAllConnection && this.getAllConnection.unsubscribe) {
      this.getAllConnection.unsubscribe();
    }
    if (this.addConnection && this.addConnection.unsubscribe) {
      this.addConnection.unsubscribe();
    }
  }

}
