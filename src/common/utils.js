import { isEmpty, trim } from "lodash";

export function getTemplateHtml(selector) {

    return $($.trim($(selector).html()))[0].outerHTML;

}
export function getTemplate(selector, model) {

    var template = kendo.template(getTemplateHtml(selector));

    return template(model);
}

export function isGuidEmpty(guid) {
    return guid === "00000000-0000-0000-0000-000000000000" || isEmpty(guid);
}

export function isNumeric(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
}

export function isNullOrEmpty(value) {
    return isEmpty(trim(value));
}

export function formatAddress(address) {

    let hasAddress1 = !isNullOrEmpty(address.Address1),
        hasAddress2 = !isNullOrEmpty(address.Address2),
        zip = isNullOrEmpty(address.Zip) ? "" : ` ${address.Zip}`,
        htmlAddress = hasAddress1 && hasAddress2 ? `${address.Address1} ${address.Address2}` : address.Address1,
        addressConcat = `${htmlAddress},${address.City},${address.State.Code}${zip}`,
        finalAddress = addressConcat === ",," ? "No Address" : addressConcat;

    return finalAddress;
}