/* beautify preserve:start */
import { inject } from 'aurelia-dependency-injection';
import {DialogController} from 'aurelia-dialog';
import { routes } from '../constants';
/* beautify preserve:end */

@inject(DialogController)
export class ActivationCompleteModal {

  controller = null;
  model = null;

  constructor(controller) {
    this.controller = controller;
  }

  activate(model) {
    this.model = model;
  }

  toHome() {
    window.location.href = routes.home;
    this.controller.ok();
  }

  toDashboard() {
    window.location.href = routes.manageCreditItems;
    this.controller.ok();
  }
}
