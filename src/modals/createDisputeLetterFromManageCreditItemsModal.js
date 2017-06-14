/* beautify preserve:start */
import { inject } from 'aurelia-dependency-injection';
import { DialogController } from 'aurelia-dialog';
import { management } from '../common/repository';
import * as loadingScreen from '../common/loadingScreen';
import { getTemplateHtml } from '../common/utils';
import * as constants from '../constants';
import { find } from 'lodash';
import '../styles/modals/createDisputeLetterFromManageCreditItemsModal.less';
/* beautify preserve:end */

@inject(DialogController)
export class CreateDisputeLetterFromManageCreditItemsModal {

  controller = null;
  model = null;
  activeStep = 1;
  steps = ['stepOne', 'stepTwo', 'stepThree'];
  data = [];

  constructor(controller, controllerFactory) {
    this.controller = controller;
  }

  attached() {
    loadingScreen.hide();
  }

  activate(model) {
    this.model = model;
  }

  showStep(stepNumber) {
    this.activeStep = stepNumber;
    this.model.display.footer = stepNumber === 1 ? 'none' : '';


    for (let i = 1; i < this.steps.length + 1; i++) {
      const step = this.steps[i - 1];
      this.model.display[step] = i === stepNumber ? '' : 'none';
    }
  }

  back() {
    this.showStep(this.activeStep - 1);
  }

  /// Step One
  stepOneTransUnion() {
    this.model.creditBureau = constants.creditBureaus.transUnion;
    this.showStep(this.activeStep + 1);
  }

  stepOneEquifax() {
    this.model.creditBureau = constants.creditBureaus.equifax;
    this.showStep(this.activeStep + 1);
  }

  stepOneExperian() {
    this.model.creditBureau = constants.creditBureaus.experian;
    this.showStep(this.activeStep + 1);
  }

  /// Step Two
  selectAllItems() {
    this.showStep(this.activeStep + 2);
  }

  chooseSpecificItems() {
    this.showStep(this.activeStep + 1);
  }


}
