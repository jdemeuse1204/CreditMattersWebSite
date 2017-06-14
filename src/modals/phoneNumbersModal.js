/* beautify preserve:start */
import { inject } from 'aurelia-dependency-injection';
import { DialogController } from 'aurelia-dialog';
import { account } from '../common/repository';
import * as loadingScreen from '../common/loadingScreen';
import { ValidationControllerFactory, ValidationRules } from 'aurelia-validation';
import { CMRenderer } from '../common/cmRenderer';
import { validateMultiple } from '../common/cmValidate';
import { isNumeric } from '../common/utils';
import { validate } from '../common/cmValidate';
import { isEmpty } from 'lodash';
import * as constants from '../constants';
import '../styles/modals/phoneNumbersModal.less';
/* beautify preserve:end */

@inject(DialogController, ValidationControllerFactory)
export class PhoneNumbersModal {

  controller = null;
  validationController = null;
  model = null;
  rules = [];
  displayError = 'none';
  displayErrorText = '';

  constructor(controller, controllerFactory) {
    this.controller = controller;

    this.validationController = controllerFactory.createForCurrentScope();
    this.validationController.addRenderer(new CMRenderer());
  }

  attached() {


  }

  activate(model) {
    this.model = model;

    const isPhoneNumberValid = (number) => {

      if (!!number) {
        return isNumeric(number) && number.length === 10;
      }

      return true;
    };

    this.rules = ValidationRules
      .ensure('homePhoneNumber').satisfies(isPhoneNumberValid).withMessage('Must be 10 numbers')
      .ensure('workPhoneNumber').satisfies(isPhoneNumberValid).withMessage('Must be 10 numbers')
      .ensure('mobilePhoneNumber').satisfies(isPhoneNumberValid).withMessage('Must be 10 numbers')
      .on(this.model)
      .rules;
  }

  save() {
    const that = this;

    validate(this.validationController).then(() => {

      that.displayError = 'none';
      that.displayErrorText = '';
      const homeNumberIsEmpty = isEmpty(that.model.homePhoneNumber);
      const workNumberIsEmpty = isEmpty(that.model.workPhoneNumber);
      const mobileNumberIsEmpty = isEmpty(that.model.mobilePhoneNumber);

      if (workNumberIsEmpty && homeNumberIsEmpty && mobileNumberIsEmpty) {
        that.displayError = '';
        that.displayErrorText = 'Please enter at least one phone number';
        return;
      }

      switch (that.model.primaryNumberId) {
        case constants.phoneNumberTypeIds.home:
          if (homeNumberIsEmpty) {
            that.displayError = '';
            that.displayErrorText = 'Must enter home number for it to be the primary number';
            return;
          }
          break;
        case constants.phoneNumberTypeIds.work:
          if (workNumberIsEmpty) {
            that.displayError = '';
            that.displayErrorText = 'Must enter work number for it to be the primary number';
            return;
          }
          break;
        case constants.phoneNumberTypeIds.mobile:
          if (mobileNumberIsEmpty) {
            that.displayError = '';
            that.displayErrorText = 'Must enter mobile number for it to be the primary number';
            return;
          }
          break;
      }

      loadingScreen.show();

      account.saveUserPhoneNumbers({
        MobileNumber: that.model.mobilePhoneNumber,
        HomeNumber: that.model.homePhoneNumber,
        WorkNumber: that.model.workPhoneNumber,
        IsMobilePrimary: that.model.primaryNumberId === constants.phoneNumberTypeIds.mobile,
        IsHomePrimary: that.model.primaryNumberId === constants.phoneNumberTypeIds.home,
        IsWorkPrimary: that.model.primaryNumberId === constants.phoneNumberTypeIds.work
      }).then(() => {
        loadingScreen.hide();
        that.controller.ok();
      });
    }).catch((result) => {});
  }
}
