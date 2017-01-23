import { ValidationRenderer, RenderInstruction, ValidationError } from 'aurelia-validation';
import { includes } from 'lodash';

export class CMRenderer {
  render(instruction) {

    if (instruction.kind === "reset") {

      for (let { result, elements } of instruction.unrender) {
        for (let element of elements) {
          reset(element, result);
        }
      }

    } else {

      for (let { result, elements } of instruction.render) {
        for (let element of elements) {

          if (!!result && result.valid === true) {
            success(element, result);
          } else {
            fail(element, result);
          }
        }
      }

    }
  }
}

function success(element, result) {

  const renderType = getCustomRenderType(result.rule.tag);

  switch (renderType) {
    case "default":
      successDefault(element);
      break;
    case "kendoDropDownList":
      successKendoDropDown(element);
      break;
  }
}

function reset(element, result) {

  const renderType = getCustomRenderType(result.rule.tag);

  switch (renderType) {
    case "default":
      resetDefault(element);
      break;
    case "kendoDropDownList":
      resetKendoDropDown(element);
      break;
  }
}

function fail(element, result) {

  const renderType = getCustomRenderType(result.rule.tag);

  switch (renderType) {
    case "default":
      failDefault(element, result);
      break;
    case "kendoDropDownList":
      failKendoDropDown(element, result);
      break;
  }
}

function successDefault(element) {

  const $parent = $(element).parent(),
    $i = $parent.find(".input-group-addon i");

  renderSuccess($parent, $i);
}

function resetKendoDropDown() {
  const $parent = $(element).parent().parent(),
    $i = $parent.find(".input-group-addon i.fa*");

  renderReset($parent, $i);
}

function resetDefault(element) {
  const $parent = $(element).parent(),
    $i = $parent.find(".input-group-addon i");

  renderReset($i, $parent);
}

function renderReset(i, parent) {
  parent.removeClass("v-error").removeClass("v-success");
  i.removeClass("fa-asterisk").removeClass("fa-exclamation-triangle").removeClass("fa-check");

  i.addClass("fa-asterisk");
  parent.find('div.cm-error-message').remove();
}

function successKendoDropDown(element) {

  const $parent = $(element).parent().parent(),
    $i = $parent.find(".input-group-addon i.fa*");

  renderSuccess($parent, $i);
}

function failDefault(element, result) {

  const $parent = $(element).parent(),
    $i = $parent.find(".input-group-addon i");

  renderFail($parent, $i, result.message);
}

function failKendoDropDown(element, result) {

  const $parent = $(element).parent().parent(),
    $i = $parent.find(".input-group-addon i.fa*");

  renderFail($parent, $i, result.message);
}

function renderSuccess(parent, i) {
  parent.removeClass("v-error").removeClass("v-success");
  i.removeClass("fa-asterisk").removeClass("fa-exclamation-triangle").removeClass("fa-check");

  i.addClass("fa-check");
  parent.addClass("v-success");
  parent.find('div.cm-error-message').remove();
}

function renderFail(parent, i, message) {
  parent.removeClass("v-error").removeClass("v-success");
  i.removeClass("fa-asterisk").removeClass("fa-exclamation-triangle").removeClass("fa-check");

  i.addClass("fa-exclamation-triangle");
  parent.addClass("v-error");

  // remove last error so they don't stack
  parent.find('div.cm-error-message').remove();
  $(`<div class='v-error cm-error-message'>${message}</div>`).appendTo(parent);
}

function getCustomRenderType(tag) {

  if (!tag) {
    return "default";
  }

  const index = tag.indexOf(":");

  if (index === -1) {
    return "default";
  }

  return tag.slice(index + 1, tag.length);
}