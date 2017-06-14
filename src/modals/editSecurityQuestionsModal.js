/* beautify preserve:start */
import { inject } from 'aurelia-dependency-injection';
import { DialogController } from 'aurelia-dialog';
import { account, register } from '../common/repository';
import * as loadingScreen from '../common/loadingScreen';
import { ValidationControllerFactory, ValidationRules } from 'aurelia-validation';
import { CMRenderer } from '../common/cmRenderer';
import { validateMultiple } from '../common/cmValidate';
import '../styles/modals/editSecurityQuestionsModal.less';
/* beautify preserve:end */

@inject(DialogController, ValidationControllerFactory)
export class EditSecurityQuestionsModal {

  controller = null;
  validationController = null;
  model = null;
  rules = [];
  securityQuestions = [];
  displayError = 'none';
  displayErrorText = '';

  constructor(controller, controllerFactory) {
    this.controller = controller;

    this.validationController = controllerFactory.createForCurrentScope();
    this.validationController.addRenderer(new CMRenderer());
  }

  attached() {


  }

  async activate(model) {
    this.model = model;

    const securityQuestionsResponse = await register.getSecurityQuestions();

    this.securityQuestions = securityQuestionsResponse.Data.result;

    loadingScreen.hide();

    this.rules = ValidationRules
      .ensure('securityQuestionOneId').satisfies(w => w > 0).tag('default:kendoDropDownList').withMessage('Please choose question')
      .ensure('securityQuestionTwoId').satisfies(w => w > 0).tag('default:kendoDropDownList').withMessage('Please choose question')
      .ensure('securityAnswerOne').required().tag('default')
      .ensure('securityAnswerTwo').required().tag('default')
      .on(this.model)
      .rules;
  }

  save() {

    // add button to remove security questions completely
    const that = this;
    const defaultKendoRules = ValidationRules.taggedRules(this.rules, 'default:kendoDropDownList');
    const defaultRules = ValidationRules.taggedRules(this.rules, 'default');
    const validateOptions = [{
      object: this.model,
      rules: defaultKendoRules
    }, {
      object: this.model,
      rules: defaultRules
    }];

    validateMultiple(this.validationController, validateOptions).then(() => {

      const payload = {
        securityQuestionOneId: that.model.securityQuestionOneId,
        securityQuestionTwoId: that.model.securityQuestionTwoId,
        securityAnswerOne: that.model.securityAnswerOne,
        securityAnswerTwo: that.model.securityAnswerTwo
      };

      loadingScreen.show();

      account.saveSecurityQuestions(payload).then((response) => {

        if (response.Data.success === true) {
          that.model.display.questions = 'none';
          that.model.display.success = '';
          that.model.display.fail = 'none';
        } else {
          that.model.display.questions = 'none';
          that.model.display.success = 'none';
          that.model.display.fail = '';
        }

      }).catch(() => {
        that.model.display.questions = 'none';
        that.model.display.success = 'none';
        that.model.display.fail = '';
      }).finally(() => {
        loadingScreen.hide();
      });

    }).catch((result) => {});
  }
}
