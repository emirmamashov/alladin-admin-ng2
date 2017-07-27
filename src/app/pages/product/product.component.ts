import { Component, OnInit, OnDestroy } from '@angular/core';

// config
import { Notify_config, Api_config, Translit_alhabets } from '../../config';

// models
import { Product } from '../../models/product';
import { ResponseApi } from '../../models/response';
import { SelectItem } from 'primeng/primeng';
import { Category } from '../../models/category';
import { Notify } from '../../models/notify';
import { Producer } from '../../models/producer';
import { PromoSticker } from '../../models/promo-sticker';
import { Photo } from '../../models/photo';

// services
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { NotifyService } from '../../services/notify.service';
import { ProducerService } from '../../services/producer.service';
import { PromoStickerService } from '../../services/promo-sticker.service';
import { TranslitService } from '../../services/translit.service';
import { PhotoService } from '../../services/photo.service';

declare var $: any;
declare var CKEDITOR: any;

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css',
  '../../../assets/ckeditor/samples/toolbarconfigurator/lib/codemirror/neo.css'
],
  providers: [
    ProductService,
    CategoryService,
    ProducerService,
    PromoStickerService,
    TranslitService,
    PhotoService
  ]
})
export class ProductComponent implements OnInit, OnDestroy {
  products = new Array<Product>();
  producers = new Array<Producer>();
  categories = new Array<Category>();
  promoStickers = new Array<PromoSticker>();

  downloadedPhotos = new Array<Photo>();
  photos = new Array<Photo>();

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
  photosSelectItems: SelectItem[] = [];

  // connections
  getAllConnection: any;
  categoryAddConnection: any;
  getAllCategoriesConnection: any;
  getAllProducersConnection: any;
  addProducerConnection: any;
  getAllPromoStickersConnection: any;
  addPromoStickerConnection: any;
  addProductConnection: any;
  getAllPhotosConnection: any;

  content: any;
  text: any;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private producerService: ProducerService,
    private promorStickerService: PromoStickerService,
    private notifyService: NotifyService,
    private translitService: TranslitService,
    private photoService: PhotoService
  ) {
    this.content = '<p>Hello <strong>World !</strong></p>'
  }

  ngOnInit() {
    this.cities.push({ label: 'Select City', value: null });
    this.categoriesItem.push({ label: 'Выберите категорию', value: '' });
    this.getAll();
    this.getAllCategories();
    this.getAllProducers();
    this.getAllPromoStickers();
    this.getAllPhotos();
  }

  getAll() {
    this.getAllConnection = this.productService.getAll().subscribe(
      (response: ResponseApi) => {
        if (response.success) {
          this.products = response.data.data.products;
          this.photos = response.data.data.photos;
          this.setPhotosInProducts(this.products, this.photos);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  setPhotosInProducts(products: Array<Product>, photos: Array<Photo>) {
    products.forEach((product) => {
      product.photos = product.photos || [];
      const photosModel = [];
      product.photos.forEach((id) => {
        const findPhoto = photos.filter(x => x._id === id)[0];
        if (findPhoto) {
          photosModel.push(findPhoto);
        }
      });
      product.photosModel = photosModel;
    });
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

  addProduct(product: Product) {
    console.log(product);
    const notify = new Notify();
    notify.type = Notify_config.typeMessage.danger;
    notify.text = 'Что то пошло не так';

    if (!product) {
      notify.text = 'Пожалуйста заполните поля!';
      console.log('product is null');
      return this.notifyService.addNotify(notify);
    }

    product = this.toTranslit(product);
    product = this.toTranslitForSeoUrl(product);
    product.photos = product.photos || [];
    console.dir(this.downloadedPhotos);
    this.downloadedPhotos.forEach((photo) => {
      product.photos.push(photo._id);
    });

    this.addProductConnection = this.productService.add(product).subscribe(
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
        addedProduct.photosModel = this.downloadedPhotos;
        this.products.push(addedProduct);

        $('#modal').modal('toggle');
      },
      (err) => {
        console.log(err);
      }
    );
  }

  toTranslit(product: Product): Product {
    console.log('--------------toTranslit-----------');

    const translit_name = this.translitService.translitToLatin(product.name);
    product.htmlH1 = translit_name;
    product.htmlTitle = translit_name;
    product.metaKeywords = translit_name;

    const translit_description = this.translitService.translitToLatin(product.description);
    product.metaDescription = translit_description;

    console.log(product);
    return product;
  }

  toTranslitForSeoUrl(product: Product) {
    console.log('--------------toTranslitForSeoUrl-----------');

    const translit_name = this.translitService.translitToLatinForSeoUrl(product.name);
    product.seoUrl = translit_name;
    return product;
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

  uploadImage(image: any) {
    console.dir(image);
    if (!image || !image.files || image.files.length === 0) {
      return console.log('image files is not correct!');
    }
    const photo = new Photo();
    photo.name = image.files[0].name;
    photo.description = photo.name;
    const photoNameTranslit = this.translitService.translitToLatin(photo.name);
    photo.htmlH1 = photoNameTranslit;
    photo.htmlTitle = photoNameTranslit;
    photo.keywords = photoNameTranslit;
    photo.metaDescription = photoNameTranslit;
    photo.metaKeywords = photoNameTranslit;
    this.photoService.add(image.files, photo).subscribe(
      (response: ResponseApi) => {
        console.log(response);
        if (response.success) {
          const downloadedPhoto: Photo = response.data.data.photo;
          this.downloadedPhotos.push(downloadedPhoto);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

   setPhotosItem(photos: Array<Photo>) {
    photos.forEach((photo) => {
      this.photosSelectItems.push({ label: photo.name, value: {id: photo._id, url: Api_config.rootUrl + '/' + photo.url }});
    });
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

  ngOnDestroy() {
    if (this.getAllConnection && this.getAllConnection.unsubscribe) {
      this.getAllConnection.unsubscribe();
    }
    if (this.categoryAddConnection && this.categoryAddConnection.unsubscribe) {
      this.categoryAddConnection.unsubscribe();
    }
    if (this.getAllCategoriesConnection && this.getAllCategoriesConnection.unsubscribe) {
      this.getAllCategoriesConnection.unsubscribe();
    }
    if (this.getAllProducersConnection && this.getAllProducersConnection.unsubscribe) {
      this.getAllProducersConnection.unsubscribe();
    }
    if (this.addProducerConnection && this.addProducerConnection.unsubscribe) {
      this.addProducerConnection.unsubscribe();
    }
    if (this.getAllPromoStickersConnection && this.getAllPromoStickersConnection.unsubscribe) {
      this.getAllPromoStickersConnection.unsubscribe();
    }
    if (this.addPromoStickerConnection && this.addPromoStickerConnection.unsubscribe) {
      this.addPromoStickerConnection.unsubscribe();
    }
    if (this.addProductConnection && this.addProductConnection.unsubscribe) {
      this.addProductConnection.unsubscribe();
    }
    if (this.getAllPhotosConnection && this.getAllPhotosConnection.unsubscribe) {
      this.getAllPhotosConnection.unsubscribe();
    }
  }

}
