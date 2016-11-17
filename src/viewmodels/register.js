import { useView } from 'aurelia-framework';
import { register } from '../common/repository';
import { DialogService } from 'aurelia-dialog';
import { inject } from 'aurelia-dependency-injection';
import { ValidationControllerFactory, ValidationRules } from 'aurelia-validation';
import { CMRenderer } from '../common/cmRenderer';
import { validate } from '../common/cmValidate';

@inject(ValidationControllerFactory, DialogService)
@useView('../views/register.html')
export class Register {

    registerDisplay = "";
    registerDoneDisplay = "none";
    firstName = "";
    lastName = "";
    email = "";
    password = "";
    securityAnswerOne = "";
    securityAnswerTwo = "";
    securityQuestionOneId = 0;
    securityQuestionTwoId = 0;
    securityQuestions = [];

    controller = null;
    dialogService = null;

    constructor(controllerFactory, dialogService) {

        this.controller = controllerFactory.createForCurrentScope();
        this.controller.addRenderer(new CMRenderer());
        this.dialogService = dialogService;

    }

    async activate() {
        let response = await register.getSecurityQuestions();

        this.securityQuestions = response.Data.result;
    }

    homeClick() {

    }

    submitRegistration() {
        debugger;
    }
}

ValidationRules
    .ensure('firstName').required()
    .ensure('lastName').required()
    .on(Register);