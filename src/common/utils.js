import { isEmpty, trim } from 'lodash';

export function getTemplateHtml(selector) {
  return $($.trim($(selector).html()))[0].outerHTML;
}
export function getTemplate(selector, model) {
  let template = kendo.template(getTemplateHtml(selector));

  return template(model);
}

export function isGuidEmpty(guid) {
  return guid === '00000000-0000-0000-0000-000000000000' || isEmpty(guid);
}

export function isNumeric(value) {
  if (typeof value === 'string') {
    const convertedValue = replaceAll(value, ',', '');
    return !isNaN(parseFloat(convertedValue)) && isFinite(convertedValue);
  }

  return !isNaN(parseFloat(value)) && isFinite(value);
}

export function replaceAll(string, oldValue, newValue) {
  return string.replace(new RegExp(oldValue, 'g'), newValue);
}

export function isNullOrEmpty(value) {
  return isEmpty(trim(value));
}

export function formatAddress(address) {
  let hasAddress1 = !isNullOrEmpty(address.Address1);
  let hasAddress2 = !isNullOrEmpty(address.Address2);
  let zip = isNullOrEmpty(address.Zip) ? '' : ` ${address.Zip}`;
  let htmlAddress = hasAddress1 && hasAddress2 ? `${address.Address1} ${address.Address2}` : address.Address1;
  let addressConcat = `${htmlAddress},${address.City},${address.State.Code}${zip}`;
  let finalAddress = addressConcat === ',,' ? 'No Address' : addressConcat;

  return finalAddress;
}

export function toArrayFromKendoDataSource(source) {
  let result = [];

  for (let i = 0; i < source.length; i++) {
    result.push(source[i]);
  }

  return result;
}
