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
  producerId: string;
  categoryId: string;
  promoStickerId: string;
  categories: Array<string>;
  images: any;
  image: string;
  isHot: boolean;
  filters: Array<string>;
  priceTrade: number;
  comments: string;
}
