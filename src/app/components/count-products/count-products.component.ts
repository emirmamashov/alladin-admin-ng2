// services
import { Component, OnInit, Input } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { UnsubscribeService } from '../../services/unsubscribe.service';

@Component({
  selector: 'app-count-products',
  templateUrl: './count-products.component.html',
  styleUrls: ['./count-products.component.css'],
  providers: [
    ProductService
  ]
})
export class CountProductsComponent implements OnInit {
  @Input('categoryId') categoryId: string;
  subscribes = new Array<any>();
  countProducts = 0;

  constructor(
    private productService: ProductService,
    private unsubscribeService: UnsubscribeService
  ) { }

  ngOnInit() {
    this.getCountProductsByCategory();
  }

  getCountProductsByCategory() {
    console.log('----------getCountProductsByCategory------------');
    if (!this.categoryId) {
      return console.log('categoryId is null');
    }
    console.log(this.categoryId);
    this.productService.getCountProductsByCategory(this.categoryId).subscribe(
      (response: any) => {
        console.log(response);
        if (response.success) {
          this.countProducts = response.data.data;
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

}
