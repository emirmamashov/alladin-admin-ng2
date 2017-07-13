import { Component, OnInit, OnDestroy } from '@angular/core';

// models
import { Category } from '../../models/category';
import { ResponseApi } from '../../models/response';

// services
import { CategoryService } from '../../services/category.service';

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

  getAllConnection: any;

  constructor(
    private categoryService: CategoryService
  ) { }

  ngOnInit() {
    this.getAll();
  }

  getAll() {
    this.getAllConnection = this.categoryService.getAll().subscribe(
      (response: ResponseApi) => {
        console.log(response);
        if (response.success) {
          this.categories = response.data.data.categories;
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  ngOnDestroy() {
    if (this.getAllConnection && this.getAllConnection.unsubscribe) {
      this.getAllConnection.unsubscribe();
    }
  }

}
