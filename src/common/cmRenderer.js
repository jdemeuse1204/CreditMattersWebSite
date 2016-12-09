import { ValidationRenderer, RenderInstruction, ValidationError } from 'aurelia-validation';

export class CMRenderer {
  render(instruction) {

    // for (let { error, result, elements } of instruction.unrender) {
    //   for (let element of elements) {
    //     debugger;
    //     success(element);
    //   }
    // }

    for (let { result, elements } of instruction.render) {
      for (let element of elements) {

        if (!!result && result.valid === true) {
          success(element);
        } else {
          fail(element, result);
        }
      }
    }
  }
}

function success(element) {
  const $parent = $(element).parent(),
    $i = $parent.find(".input-group-addon i");

  $parent.removeClass("v-error").removeClass("v-success");
  $i.removeClass("fa-asterisk").removeClass("fa-exclamation-triangle").removeClass("fa-check");

  $i.addClass("fa-check");
  $parent.addClass("v-success");
  $parent.find('div.cm-error-message').remove();
}

function fail(element, result) {

  const $parent = $(element).parent(),
    $i = $parent.find(".input-group-addon i");

  $parent.removeClass("v-error").removeClass("v-success");
  $i.removeClass("fa-asterisk").removeClass("fa-exclamation-triangle").removeClass("fa-check");

  $i.addClass("fa-exclamation-triangle");
  $parent.addClass("v-error");

  // remove last error so they don't stack
  $parent.find('div.cm-error-message').remove();
  $(`<div class='v-error cm-error-message'>${result.message}</div>`).appendTo($parent);
}