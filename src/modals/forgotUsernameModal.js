/* beautify preserve:start */
import { inject } from 'aurelia-dependency-injection';
import { DialogController } from 'aurelia-dialog';
import { account } from '../common/repository';
import * as loadingScreen from '../common/loadingScreen';
import { ValidationControllerFactory, ValidationRules } from 'aurelia-validation';
import { CMRenderer } from '../common/cmRenderer';
import { validate } from '../common/cmValidate';
import '../styles/index.less';
import '../styles/modals/index.less';
import 'font-awesome/css/font-awesome.css';
import 'bootstrap/dist/css/bootstrap.css';
/* beautify preserve:end */

@inject(DialogController, ValidationControllerFactory)
export class ForgotUsernameModal {

  controller = null;
  validationController = null;
  model = null;
  rules = [];

  constructor(controller, controllerFactory) {
    this.controller = controller;

    this.validationController = controllerFactory.createForCurrentScope();
    this.validationController.addRenderer(new CMRenderer());
  }

  activate(model) {
    this.model = model;

    const isPhoneNumberValid = (number) => {
      if (!!number) {
        return isNumeric(number) && number.length === 10;
      }

      return false;
    };

    this.rules = ValidationRules
      .ensure('emailAddress').required().tag('email')
      .ensure('phoneNumber').satisfies(isPhoneNumberValid).withMessage('Must be 10 numbers').tag('phone')
      .on(this.model)
      .rules;
  }

  back() {
    this.model.display.initialStep = '';
    this.model.display.phoneNumber = 'none';
    this.model.display.emailAddress = 'none';
  }

  recoverWithPhoneNumber() {
    this.model.display.initialStep = 'none';
    this.model.display.phoneNumber = '';
  }

  recoverWithEmailAddress() {
    this.model.display.initialStep = 'none';
    this.model.display.emailAddress = '';
  }

  submitEmailAddress() {
    const that = this;
    const emailRules = ValidationRules.taggedRules(this.rules, 'email');

    validate(this.validationController, {
      object: this.model,
      rules: emailRules
    }).then(() => {

    }).catch((result) => {});
  }

  submitPhoneNumber() {
    // to recover, add a new aspnet_usernameRecovery record to the database, route the user to a new page with the a guid parameter
    // need to make sure the recovering user is getting the username
    const that = this;
    const phoneRules = ValidationRules.taggedRules(this.rules, 'phone');

    validate(this.validationController, {
      object: this.model,
      rules: phoneRules
    }).then(() => {

    }).catch((result) => {});
  }
}
