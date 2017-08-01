import { environment } from '../environments/environment';

const apiUrl: string = environment.apiUrl;
export const LimitCategoriesViewInMenu = 10;
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
      url: apiUrl + '/products/update'
    },
    import: {
      method: 'POST',
      url: apiUrl + '/products/import'
    },
    remove: {
      method: 'DELETE',
      url: apiUrl + '/products/remove' // :id
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
    },
    update: {
      method: 'PUT',
      url: apiUrl + '/categories/update' // :id
    },
    remove: {
      method: 'DELETE',
      url: apiUrl + '/categories/remove' // :id
    }
  },
  banner: {
    getAll: {
      method: 'GET',
      url: apiUrl + '/banners'
    },
    add: {
      method: 'POST',
      url: apiUrl + '/banners/add'
    },
    update: {
      method: 'PUT',
      url: apiUrl + '/banners/update' // :id
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
    },
    update: {
      method: 'PUT',
      url: apiUrl + '/producers/update'
    },
    remove: {
      method: 'DELETE',
      url: apiUrl + '/producers/remove'
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
  },
  photo: {
    add: {
      method: 'POST',
      url: apiUrl + '/photos/add'
    },
    getAll: {
      method: 'GET',
      url: apiUrl + '/photos'
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

export const Translit_alhabets = {
  'А': 'A',
  'а': 'a',
  'Б': 'B',
  'б': 'b',
  'В': 'V',
  'в': 'v',
  'Г': 'G',
  'г': 'g',
  'Д': 'D',
  'д': 'd',
  'Е': 'E',
  'е': 'e',
  'Ё': 'E',
  'ё': 'e',
  'Ж': 'J',
  'ж': 'j',
  'З': 'Z',
  'з': 'z',
  'И': 'I',
  'и': 'i',
  'Й': 'I',
  'й': 'i',
  'К': 'K',
  'к': 'k',
  'Л': 'L',
  'л': 'l',
  'М': 'M',
  'м': 'm',
  'Н': 'N',
  'н': 'n',
  'О': 'O',
  'о': 'o',
  'П': 'P',
  'п': 'p',
  'Р': 'R',
  'р': 'r',
  'С': 'S',
  'с': 's',
  'Т': 'T',
  'т': 't',
  'У': 'U',
  'у': 'u',
  'Ф': 'F',
  'ф': 'f',
  'Х': 'H',
  'х': 'h',
  'Ц': 'Z',
  'ц': 'z',
  'Ч': 'Ch',
  'ч': 'ch',
  'Ш': 'Sh',
  'ш': 'sh',
  'Щ': 'Zsh',
  'щ': 'zsh',
  'Ъ': '',
  'ъ': '',
  'Ы': 'I',
  'ы': 'i',
  'Ь': '',
  'ь': '',
  'Э': 'E',
  'э': 'e',
  'Ю': 'Yu',
  'ю': 'yu',
  'Я': 'Ya',
  'я': 'ya'
}
