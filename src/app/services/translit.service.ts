import { Injectable } from '@angular/core';

// config
import { Translit_alhabets } from '../config';

@Injectable()
export class TranslitService {

  constructor() { }

  translitToLatin(russion_word): string {
    let output_word = '';
    for (let i = 0; i < russion_word.length; i++) {
      if (Translit_alhabets[russion_word[i]]) {
        output_word += Translit_alhabets[russion_word[i]];
      } else {
        output_word += russion_word[i];
      }
    }

    return output_word;
  }
}
