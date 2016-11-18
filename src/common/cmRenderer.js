import { ValidationRenderer, RenderInstruction, ValidationError } from 'aurelia-validation';

export class CMRenderer {
  render(instruction) {

    for (let { error, elements } of instruction.unrender) {
      for (let element of elements) {
        success(element);
      }
    }

    for (let { error, elements } of instruction.render) {
      for (let element of elements) {
        fail(element, error);
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

function fail(element, error) {

  const $parent = $(element).parent(),
    $i = $parent.find(".input-group-addon i");

  $parent.removeClass("v-error").removeClass("v-success");
  $i.removeClass("fa-asterisk").removeClass("fa-exclamation-triangle").removeClass("fa-check");

  $i.addClass("fa-exclamation-triangle");
  $parent.addClass("v-error");

  // remove last error so they don't stack
  $parent.find('div.cm-error-message').remove();
  $(`<div class='v-error cm-error-message'>${error.message}</div>`).appendTo($parent);
}