import { inject } from 'aurelia-dependency-injection';
import { DialogController } from 'aurelia-dialog';
import { account, register } from '../common/repository';
import * as loadingScreen from '../common/loadingScreen';
import { ValidationControllerFactory, ValidationRules } from 'aurelia-validation';
import { CMRenderer } from '../common/cmRenderer';
import { validate } from '../common/cmValidate';

@inject(DialogController, ValidationControllerFactory)
export class EditSecurityQuestionsModal {

    controller = null;
    validationController = null;
    model = null;
    rules = [];
    securityQuestions = [];
    displayError = "none";
    displayErrorText = "";

    constructor(controller, controllerFactory) {
        this.controller = controller;

        this.validationController = controllerFactory.createForCurrentScope();
        this.validationController.addRenderer(new CMRenderer());
    }

    attached() {


    }

    async activate(model) {

        this.model = model

        const securityQuestionsResponse = await register.getSecurityQuestions();

        this.securityQuestions = securityQuestionsResponse.Data.result;

        loadingScreen.hide();

        this.rules = ValidationRules
            .ensure('securityQuestionOneId').satisfies(w => w > 0).withMessage('Please choose question')
            .ensure('securityQuestionTwoId').satisfies(w => w > 0).withMessage('Please choose question')
            .ensure('securityAnswerOne').required()
            .ensure('securityAnswerTwo').required()
            .on(this.model)
            .rules;
    }

    save() {

        // add button to remove security questions completely

        validate(this.validationController, { object: this.model, rules: this.rules }).then(() => {

        }).catch((result) => { });
    }
}