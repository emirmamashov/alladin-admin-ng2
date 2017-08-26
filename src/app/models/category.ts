export class Category {
  _id: string;
  name: string;
  parentCategory: string;
  parentCategoryModel: Category;
  description: string;
  keywords: string;
  author: string;
  image: string;
  images: any;
  viewInMenu: boolean;
  viewInLikeBlock: boolean;
  showInMainPageLeft: boolean;
  showInMainPageRight: boolean;
}
