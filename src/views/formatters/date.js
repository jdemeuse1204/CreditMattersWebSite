import moment from 'moment';

export class DateValueConverter {
  toView(value) {

    if (!!value && moment(value).isValid()) {
      return moment(value).format('MM/DD/YYYY');
    }
    return 'N/A';
  }
}