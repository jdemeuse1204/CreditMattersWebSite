/* beautify preserve:start */
import { inject } from 'aurelia-dependency-injection';
import { DialogController } from 'aurelia-dialog';
import { register } from '../common/repository';
import * as loadingScreen from '../common/loadingScreen';
import { ValidationControllerFactory, ValidationRules } from 'aurelia-validation';
import { CMRenderer } from '../common/cmRenderer';
import { validate } from '../common/cmValidate';
import * as constants from '../constants';
import { isEmpty } from 'lodash';
/* beautify preserve:end */

@inject(DialogController, ValidationControllerFactory)
export class ResendRegistrationEmail {

  controller = null;
  validationController = null;
  model = null;
  rules = [];

  constructor(controller, controllerFactory) {
    this.controller = controller;

    this.validationController = controllerFactory.createForCurrentScope();
    this.validationController.addRenderer(new CMRenderer());
  }

  attached() {


  }

  activate(model) {
    this.model = model;
    this.rules = ValidationRules
      .ensure('emailAddress').required()
      .on(this.model)
      .rules;
  }

  sendEmail() {
    const that = this;

    validate(this.validationController, {
      object: this.model,
      rules: this.rules
    }).then(() => {
      loadingScreen.show();

      register.resendRegistrationEmail(that.model.emailAddress).then((response) => {

        switch (response.Data.result.result) {
          case 0: //Success
            that.model.display.error = 'none';
            that.model.display.success = '';
            that.model.display.email = 'none';
            break;
          case 1: //Failed
          case 2: //UserDoesntExist
            that.model.display.error = '';
            that.model.display.success = 'none';
            that.model.display.email = 'none';
            that.model.errorText = 'Unable to send email to the provided address.  Please make sure it is correct.';
            break;
          case 3: //UserAlreadyRegistered
            that.model.display.error = '';
            that.model.display.success = 'none';
            that.model.display.email = 'none';
            that.model.errorText = 'That email address is already successfully registered.';
            break;
        }

      }).catch(() => {}).finally(() => {
        loadingScreen.hide();
      });
    }).catch(() => {});
  }
}
