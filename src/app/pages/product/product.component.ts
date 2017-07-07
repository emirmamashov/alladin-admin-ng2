import { Component, OnInit, OnDestroy } from '@angular/core';

// config
import { Notify_config, Api_config } from '../../config';

// models
import { Product } from '../../models/product';
import { ResponseApi } from '../../models/response';
import { SelectItem } from 'primeng/primeng';
import { Category } from '../../models/category';
import { Notify } from '../../models/notify';
import { Producer } from '../../models/producer';
import { PromoSticker } from '../../models/promo-sticker';

// services
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { NotifyService } from '../../services/notify.service';
import { ProducerService } from '../../services/producer.service';
import { PromoStickerService } from '../../services/promo-sticker.service';

declare var $: any;

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  providers: [
    ProductService,
    CategoryService,
    ProducerService,
    PromoStickerService
  ]
})
export class ProductComponent implements OnInit, OnDestroy {
  products = new Array<Product>();
  producers = new Array<Producer>();
  categories = new Array<Category>();
  promoStickers = new Array<PromoSticker>();

  newProduct = new Product();
  newCategory = new Category();
  newProducer = new Producer();
  newPromoSticker = new PromoSticker();

  showAddCategory = false;
  showAddProducer = false;
  showAddPromoSticker = false;
  isEdit = false;

  apiUrl: string = Api_config.rootUrl;

  // select items
  cities: SelectItem[] = [];
  categoriesItem: SelectItem[] = [];
  producersItem: SelectItem[] = [];
  promoStickersItem: SelectItem[] = [];

  // connections
  getAllConnection: any;
  categoryAddConnection: any;
  getAllCategoriesConnection: any;
  getAllProducersConnection: any;
  addProducerConnection: any;
  getAllPromoStickersConnection: any;
  addPromoStickerConnection: any;
  addProductConnection: any;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private producerService: ProducerService,
    private promorStickerService: PromoStickerService,
    private notifyService: NotifyService
  ) {
  }

  ngOnInit() {
    this.cities.push({ label: 'Select City', value: null });
    this.categoriesItem.push({ label: 'Выберите категорию', value: '' });
    this.getAll();
    this.getAllCategories();
    this.getAllProducers();
    this.getAllPromoStickers();
  }

  getAll() {
    this.getAllConnection = this.productService.getAll().subscribe(
      (response: ResponseApi) => {
        if (response.success) {
          this.products = response.data.data.products;
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getAllProducers() {
    this.getAllProducersConnection = this.producerService.getAll().subscribe(
      (response: ResponseApi) => {
        if (response.success) {
          this.producers = response.data.data.producers;
          this.setProducersItem();
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getAllPromoStickers() {
    this.getAllPromoStickersConnection = this.promorStickerService.getAll().subscribe(
      (response: ResponseApi) => {
        console.log(response);
        if (response.success) {
          this.promoStickers = response.data.data.promoStickers;
          this.setPromoStickersItem();
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  changeShowAddCategory() {
    this.showAddCategory = !this.showAddCategory;
  }

  changeShowAddProducer() {
    this.showAddProducer = !this.showAddProducer;
  }

  changeShowAddPromoSticker() {
    this.showAddPromoSticker = !this.showAddPromoSticker;
  }

  changeEditStatus(status: boolean) {
    this.isEdit = status;
  }

  setCategoriesItem() {
    this.categories.map((category) => {
      this.categoriesItem.push({ label: category.name, value: category._id });
    });
  }

  setProducersItem() {
    this.producers.map((producer) => {
      this.producersItem.push({ label: producer.name, value: producer._id });
    });
  }

  setPromoStickersItem() {
    this.promoStickers.map((promoSticker) => {
      this.promoStickersItem.push({ label: promoSticker.name, value: promoSticker._id });
    });
  }

  getAllCategories() {
    this.getAllCategoriesConnection = this.categoryService.getAll().subscribe(
      (response: ResponseApi) => {
        console.log(response);
        if (response.success) {
          this.categories = response.data.data.categories || this.categories;
          this.setCategoriesItem();
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  addToCategories(category: Category) {
    if (category) {
      this.categories.push(category);
    }
  }

  addToCategoriesItem(category: Category) {
    if (category) {
      this.categoriesItem.push({label: category.name, value: category._id});
    }
  }

  showValidateErrorMessages(notify: Notify, validates: Array<string>) {
    console.log(validates);
    if (validates.length > 0) {
      notify.text = '';
      validates.forEach((message) => {
        notify.text += message + '<br/>';
      });
      this.notifyService.addNotify(notify);
    }
  }

  addCategory(category: Category) {
    console.log(category);
    if (!category) { return console.log('category is null'); }
    const notify = new Notify();
    notify.type = Notify_config.typeMessage.danger;
    notify.text = 'Что то пошло не так';

    this.categoryAddConnection = this.categoryService.add(category).subscribe(
      (response: ResponseApi) => {
        console.log(response);
        if (!response.success) {
          const validates: Array<string> = response.message.validates || [];
          this.showValidateErrorMessages(notify, validates);
          return;
        }

        const addedCategory: Category = response.data.data.category || new Category();
        this.addToCategories(addedCategory);
        this.addToCategoriesItem(addedCategory);

        notify.type = Notify_config.typeMessage.success;
        notify.text = 'Сохранено!';
        this.notifyService.addNotify(notify);
        this.changeShowAddCategory();
        this.newCategory = new Category();
      },
      (err) => {
        console.log(err);
        this.notifyService.addNotify(notify);
      }
    );
  }

  addToProducers(producer: Producer) {
    if (producer) {
      this.producers.push(producer);
    }
  }

  addToProducersItem(producer: Producer) {
    if (producer) {
      this.producersItem.push({ label: producer.name, value: producer._id });
    }
  }

  addProducer(producer: Producer) {
    console.log(producer);
    const notify = new Notify();
    notify.type = Notify_config.typeMessage.danger;
    notify.text = 'Что то пошло не так';

    this.addProducerConnection = this.producerService.add(producer).subscribe(
      (response: ResponseApi) => {
        console.log(response);
        if (!response.success) {
          const validates: Array<string> = response.message.validates || [];
          this.showValidateErrorMessages(notify, validates);
          return;
        }

        const addedProducer: Producer = response.data.data.producer || new Producer();
        this.addToProducers(addedProducer);
        this.addToProducersItem(addedProducer);

        notify.type = Notify_config.typeMessage.success;
        notify.text = 'Успешно добавлено';
        this.notifyService.addNotify(notify);
        this.changeShowAddProducer();
        this.newProducer = new Producer();
      }
    );
  }

  addToPromoStickers(promoSticker: PromoSticker) {
    if (promoSticker) {
      this.promoStickers.push(promoSticker);
    }
  }

  addToPromoStickersItem(promoSticker: PromoSticker) {
    if (promoSticker) {
      this.promoStickersItem.push({ label: promoSticker.name, value: promoSticker._id });
    }
  }

  addPromoSticker(file: any, promoSticker: PromoSticker) {
    console.log(promoSticker);
    const notify = new Notify();
    notify.type = Notify_config.typeMessage.danger;
    notify.text = 'Что то пошла не так';

    console.log(file);

    this.addPromoStickerConnection = this.promorStickerService.add(file.files, promoSticker).subscribe(
      (response: ResponseApi) => {
        console.log(response);
        if (!response.success) {
          const validates: Array<string> = response.message.validates || [];
          this.showValidateErrorMessages(notify, validates);
          return;
        }
        const addedPromoSticker: PromoSticker = response.data.data.promoSticker || new PromoSticker();
        this.addToPromoStickers(addedPromoSticker);
        this.addToPromoStickersItem(addedPromoSticker);

        notify.type = Notify_config.typeMessage.success;
        notify.text = response.message;
        this.notifyService.addNotify(notify);
        this.changeShowAddPromoSticker();
        this.newPromoSticker = new PromoSticker();
      }
    );
  }

  addProduct(file: any, product: Product) {
    console.log(product);
    console.dir(file.files);
    const notify = new Notify();
    notify.type = Notify_config.typeMessage.danger;
    notify.text = 'Что то пошло не так';

    if (!product) {
      notify.text = 'Пожалуйста заполните поля!';
      console.log('product is null');
      return this.notifyService.addNotify(notify);
    }

    this.addProductConnection = this.productService.add(file.files, product).subscribe(
      (response: ResponseApi) => {
        console.log(response);
        if (!response.success) {
          const validates: Array<string> = response.message.validates || [];
          console.log(validates);
          if (validates.length > 0) {
            notify.text = '';
            validates.forEach((message) => {
              notify.text += message + '<br/>';
            });
            this.notifyService.addNotify(notify);
          }
          notify.text = response.message;
          this.notifyService.addNotify(notify);
          return;
        }

        const addedProduct: Product = response.data.data.product;
        this.products.push(addedProduct);

        $('#modal').modal('toggle');
      },
      (err) => {
        console.log(err);
      }
    );
  }

  editProduct(file: any, product: Product) {
    console.log(product);
    console.dir(file.files);
    const notify = new Notify();
    notify.type = Notify_config.typeMessage.danger;
    notify.text = 'Что то пошло не так';

    if (!product) {
      notify.text = 'Пожалуйста заполните поля!';
      return this.notifyService.addNotify(notify);
    }

    this.addProductConnection = this.productService.edit(file.files, product).subscribe(
      (response: ResponseApi) => {
        console.log(response);
        if (!response.success) {
          const validates: Array<string> = response.message.validates || [];
          console.log(validates);
          if (validates.length > 0) {
            notify.text = '';
            validates.forEach((message) => {
              notify.text += message + '<br/>';
            });
            this.notifyService.addNotify(notify);
          }
          return;
        }

        const editProduct: Product = response.data.data.product;
        let productFind: Product = this.products.filter(x => x._id === editProduct._id)[0];
        productFind = editProduct;
        console.log(productFind);

        $('#modal').modal('toggle');
      },
      (err) => {
        console.log(err);
      }
    );
  }

  clearNewProcut() {
    this.newProduct = new Product();
  }

  ngOnDestroy() {
    if (this.getAllConnection && this.getAllConnection.unsubscribe) { this.getAllConnection.unsubscribe(); }
    if (this.categoryAddConnection && this.categoryAddConnection.unsubscribe) { this.categoryAddConnection.unsubscribe(); }
    if (this.getAllCategoriesConnection && this.getAllCategoriesConnection.unsubscribe) { this.getAllCategoriesConnection.unsubscribe(); }
    if (this.getAllProducersConnection && this.getAllProducersConnection.unsubscribe) { this.getAllProducersConnection.unsubscribe(); }
    if (this.addProducerConnection && this.addProducerConnection.unsubscribe) { this.addProducerConnection.unsubscribe(); }
    if (this.getAllPromoStickersConnection && this.getAllPromoStickersConnection.unsubscribe) {
      this.getAllPromoStickersConnection.unsubscribe();
    }
    if (this.addPromoStickerConnection && this.addPromoStickerConnection.unsubscribe) {
      this.addPromoStickerConnection.unsubscribe();
    }
    if (this.addProductConnection && this.addProductConnection.unsubscribe) {
      this.addProductConnection.unsubscribe();
    }
  }

}
