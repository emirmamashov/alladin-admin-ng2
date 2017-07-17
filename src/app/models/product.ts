import { Photo } from '../models/photo';

export class Product {
  _id: string;
  name: string;
  htmlH1: string;
  htmlTitle: string;
  metaDescription: string;
  metaKeywords: string;
  description: string;
  tegs: string;
  phone: number;
  price: number;
  priceStock: number;
  seoUrl: string;
  promoStickers: string;
  photos: Array<string>;
  photosModel: Array<Photo>;
  producerId: string;
  categoryId: string;
  categories: Array<string>;
}
