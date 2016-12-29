import { isNumeric } from '../../common/utils';

export class PhoneNumberValueConverter {
  toView(value) {

    if (isNumeric(value) === false || value.length !== 10) {
      return value;
    }
    return `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
  }
}