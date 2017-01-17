import { useView } from 'aurelia-framework';
import { register } from '../common/repository';
import { DialogService } from 'aurelia-dialog';
import { inject } from 'aurelia-dependency-injection';
import { ValidationControllerFactory, ValidationRules } from 'aurelia-validation';
import { CMRenderer } from '../common/cmRenderer';
import * as validate from '../common/cmValidate';
import * as loadingScreen from '../common/loadingScreen';
import { routes } from '../constants';

@inject(ValidationControllerFactory, DialogService)
@useView('../views/register.html')
export class Register {

    registerDisplay = "";
    firstName = "";
    lastName = "";
    email = "";
    password = "";
    securityAnswerOne = "";
    securityAnswerTwo = "";
    securityQuestionOneId = 0;
    securityQuestionTwoId = 0;
    securityQuestions = [];
    rules;

    controller = null;
    dialogService = null;

    constructor(controllerFactory, dialogService) {

        this.controller = controllerFactory.createForCurrentScope();
        this.controller.addRenderer(new CMRenderer());
        this.dialogService = dialogService;
        this.rules = ValidationRules
            .ensure('firstName').displayName("First Name").required()
            .ensure('lastName').displayName("Last Name").required()
            .ensure('email').displayName("Email Address").satisfies(w => validate.isValidEmailAdddress(w))
            .ensure('password').displayName("Password").satisfies(w => validate.isPasswordCorrectLength(w)).withMessage(`\${$displayName} must be 8 characters long.`)
            .ensure('password').displayName("Password").satisfies(w => validate.containsCapitalLetter(w)).withMessage(`\${$displayName} contain an uppercase character.`)
            .ensure('password').displayName("Password").satisfies(w => validate.containsNumber(w)).withMessage(`\${$displayName} contain a number.`)
            .ensure('password').displayName("Password").satisfies(w => validate.containsSpecialCharacter(w)).withMessage(`\${$displayName} contain a special character.`)
            .on(Register).rules;

    }

    submitRegistration() {

        const that = this;

        validate.validate(this.controller).then(() => {

            loadingScreen.show();

            register.submitRegistration(that.firstName,
                that.lastName,
                that.email,
                that.password).then(response => {

                    loadingScreen.hide();

                    let modalModel = {
                        title: "Success",
                        message: "To complete the registration process, please verify your email address with instructions we just sent you.",
                        display: {
                            default: "",
                            alreadyRegistered: "none",
                            resendAuthorization: "none",
                        }
                    };

                    if (response.Data.result.registrationResult === 3) {

                        that.dialogService.open({ viewModel: 'modals/confirm', model: modalModel })
                            .then(response => {

                                that.password = "";
                                that.email = "";
                                that.firstName = "";
                                that.lastName = "";

                                window.location.href = routes.login;
                            });
                        return;
                    } 

                    modalModel.title = "Error";
                    modalModel.message = "Oops, something went wrong.";

                    if (response.Data.result.registrationResult != null) {

                        switch (response.Data.result.registrationResult) {
                            case 0:
                                modalModel.message = "Email address is already registered."; // ok, login, recover password
                                modalModel.display.alreadyRegistered = "";
                                modalModel.display.default = "none";
                                break;
                            case 1:
                                modalModel.message = "Failed to send registration email, please make sure the email address is correct."; // ok
                                break;
                            case 2:
                                modalModel.message = "Unable to create user."; // ok
                                break;
                            case 4:
                                modalModel.message = "Email address is already registered, but it needs to be authorized."; // resend auth email, ok
                                modalModel.display.resendAuthorization = "";
                                modalModel.display.default = "none";
                                break;
                        }

                    }

                    that.dialogService.open({ viewModel: 'modals/confirm', model: modalModel })
                        .then(response => {

                            that.password = "";
                            that.email = "";
                            that.firstName = "";
                            that.lastName = "";

                        });

                });
        });
    }
}

