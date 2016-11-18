export function getTemplateHtml(selector) {

    return $($.trim($(selector).html()))[0].outerHTML;

}
export function getTemplate(selector, model) {

    var template = kendo.template(getTemplateHtml(selector));

    return template(model);
}