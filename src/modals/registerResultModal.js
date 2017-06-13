/* beautify preserve:start */
import { inject } from 'aurelia-dependency-injection';
import {DialogController} from 'aurelia-dialog';
/* beautify preserve:end */

@inject(DialogController)
export class RegisterResultModal {

  controller = null;
  model = null;

  constructor(controller) {
    this.controller = controller;
  }

  activate(model) {
    this.model = model;
  }

  login() {
    window.location = '#/Login';
  }

  recoverPassword() {

  }

  resendAuthorizationEmail() {

  }
}
