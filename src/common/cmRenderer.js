import {ValidationRenderer,RenderInstruction,ValidationError} from 'aurelia-validation';

export class CMRenderer {
  render(instruction) {

    for (let { error, elements } of instruction.unrender) {
      for (let element of elements) {
        success(element);
      }
    }

    for (let { error, elements } of instruction.render) {
      for (let element of elements) {
        fail(element);
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
}

function fail(element) {
        const $parent = $(element).parent(),
          $i = $parent.find(".input-group-addon i");

      $parent.removeClass("v-error").removeClass("v-success");
      $i.removeClass("fa-asterisk").removeClass("fa-exclamation-triangle").removeClass("fa-check");

      $i.addClass("fa-exclamation-triangle");
      $parent.addClass("v-error");
}