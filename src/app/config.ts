import { environment } from '../environments/environment';

const apiUrl: string = environment.apiUrl;
export const Api_config = {
  rootUrl: apiUrl,
  product: {
    getAll: {
      method: 'GET',
      url: apiUrl + '/products'
    },
    getById: {
      method: 'GET',
      url: apiUrl + '/products' // :id
    },
    add: {
      method: 'POST',
      url: apiUrl + '/products/add'
    },
    edit: {
      method: 'POST',
      url: apiUrl + '/products/edit'
    }
  },
  category: {
    getAll: {
      method: 'GET',
      url: apiUrl + '/categories'
    },
    add: {
      method: 'POST',
      url: apiUrl + '/categories/add'
    },
    addMany: {
      method: 'POST',
      url: apiUrl + '/categories/add-many'
    }
  },
  producer: {
    getAll: {
      method: 'GET',
      url: apiUrl + '/producers'
    },
    add: {
      method: 'POST',
      url: apiUrl + '/producers/add'
    }
  },
  promoSticker: {
    getAll: {
      method: 'GET',
      url: apiUrl + '/promo-stickers'
    },
    add: {
      method: 'POST',
      url: apiUrl + '/promo-stickers/add'
    }
  }
}

export const Notify_config = {
  typeMessage: {
    danger: 'danger',
    warning: 'warning',
    success: 'success',
    info: 'info'
  }
};
