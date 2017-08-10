import { Component, OnInit, OnDestroy } from '@angular/core';

// config
import { Notify_config, Api_config, Translit_alhabets, LimitHotProduct } from '../../config';

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
  filesToReadyUpload = [];

  isEdit = false;
  isLimitHot = false;

  apiUrl: string = Api_config.rootUrl;

  // select items
  cities: SelectItem[] = [];
  categoriesItem: SelectItem[] = [];
  producersItem: SelectItem[] = [];
  promoStickersItem: SelectItem[] = [];
  photosSelectItems: SelectItem[] = [];

  // connections
  getAllConnection: any;
  getAllCategoriesConnection: any;
  getAllProducersConnection: any;
  getAllPromoStickersConnection: any;
  getAllPhotosConnection: any;
  addProductConnection: any;
  removeConnection: any;

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
    this.producersItem.push({ label: 'Выберите производителя', value: '' });
    this.promoStickersItem.push({ label: 'Выберите промостикер', value: '' });
    this.getAll();
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
          this.checkToLimitIsHotProduct(this.products);
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

  addProduct(product: Product) {
    console.log(product);
    const files = new Array<File>();
    if (this.filesToReadyUpload && this.filesToReadyUpload.length > 0) {
        this.filesToReadyUpload.forEach((fileObject) => {
        files.push(fileObject.file);
      });
    }

    if (!product) {
      return this.showMessageForUser(Notify_config.typeMessage.danger, 'Пожалуйста заполните поля!');
    }

    product = this.toTranslit(product);
    product = this.toTranslitForSeoUrl(product);
    this.addProductConnection = this.productService.add(files, product).subscribe(
      (response: ResponseApi) => {
        console.log(response);
        if (!response.success) {
          const validates: Array<string> = response.message.validates || [];
          console.log(validates);
          if (validates.length > 0) {
            let text = '';
            validates.forEach((message) => {
              text += message + '<br/>';
            });
            return this.showMessageForUser(Notify_config.typeMessage.danger, text);
          }
          return this.showMessageForUser(Notify_config.typeMessage.danger,  response.message);
        }

        const addedProduct: Product = response.data.data.product;
        this.products.push(addedProduct);

        $('#modal').modal('toggle');
      },
      (err) => {
        console.log(err);
        this.showMessageForUser(Notify_config.typeMessage.danger, 'Что то пошло не так');
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
  update(product: Product) {
    console.log(product);
    const files = new Array<File>();
    if (this.filesToReadyUpload && this.filesToReadyUpload.length > 0) {
        this.filesToReadyUpload.forEach((fileObject) => {
        files.push(fileObject.file);
      });
    }

    if (!product) {
      return this.showMessageForUser(Notify_config.typeMessage.danger, 'Пожалуйста заполните поля!');
    }

    this.addProductConnection = this.productService.update(files, product).subscribe(
      (response: ResponseApi) => {
        console.log(response);
        if (!response.success) {
          const validates: Array<string> = response.message.validates || [];
          console.log(validates);
          if (validates.length > 0) {
            let text = '';
            validates.forEach((message) => {
              text += message + '<br/>';
            });
            this.showMessageForUser(Notify_config.typeMessage.danger, text);
          }
          return;
        }

        const editProduct: Product = response.data.data.product;
        let productFind: Product = this.products.filter(x => x._id === editProduct._id)[0];
        productFind = editProduct;
        this.checkToLimitIsHotProduct(this.products);
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

  remove(_id: string) {
    this.removeConnection = this.productService.remove(_id).subscribe(
      (response: ResponseApi) => {
        console.log(response);
        if (!response.success) {
          this.showMessageForUser(Notify_config.typeMessage.danger, response.message);
          return;
        }
        this.removeInListProducts(response.data.data.product);
        this.showMessageForUser(Notify_config.typeMessage.success, response.message);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  removeInListProducts(product: Product) {
    if (product && product._id) {
      this.products = this.products.filter(x => x._id !== product._id);
    }
  }

  removeInListReadyUpload(fileName: string) {
    this.filesToReadyUpload = this.filesToReadyUpload.filter(x => x.name !== fileName);
  }

removeInProductImages(product: Product, url: string) {
  console.log('-------removeInProductImages------');
    if (product && product.images && product.images.length > 0 && url) {
      product.images = product.images.filter(x => x !== url);
    }
  }

  showMessageForUser(typeMessage: string, text: string) {
    const notify = new Notify();
    notify.type = typeMessage;
    notify.text = text;
    this.notifyService.addNotify(notify);
  }

  doLimitIsHotProduct(product: Product) {
    this.checkToLimitIsHotProduct(this.products);
    if (!product.isHot) {
      return console.log('not checked');
    }
    const text = 'Только ' + LimitHotProduct +
    ' категории можно отображат в меню, вы уже выбрали эти ' + LimitHotProduct + ':)';
    this.showMessageForUser(Notify_config.typeMessage.info, text);
    product.isHot = false;
  }
  checkToLimitIsHotProduct(products: Array<Product>) {
      if (products.filter(x => x.isHot).length >= LimitHotProduct) {
        this.isLimitHot = true;
      } else {
        this.isLimitHot = false;
      }
  }

ngOnDestroy() {
    if (this.getAllConnection && this.getAllConnection.unsubscribe) {
      this.getAllConnection.unsubscribe();
    }
    if (this.getAllCategoriesConnection && this.getAllCategoriesConnection.unsubscribe) {
      this.getAllCategoriesConnection.unsubscribe();
    }
    if (this.getAllProducersConnection && this.getAllProducersConnection.unsubscribe) {
      this.getAllProducersConnection.unsubscribe();
    }
    if (this.addProductConnection && this.addProductConnection.unsubscribe) {
      this.addProductConnection.unsubscribe();
    }
    if (this.getAllPhotosConnection && this.getAllPhotosConnection.unsubscribe) {
      this.getAllPhotosConnection.unsubscribe();
    }
    if (this.removeConnection && this.removeConnection.unsubscribe) {
      this.removeConnection.unsubscribe();
    }
  }

}
