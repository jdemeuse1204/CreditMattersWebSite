import { useView } from 'aurelia-framework';
import { register } from '../common/repository';
import { DialogService } from 'aurelia-dialog';
import { inject } from 'aurelia-dependency-injection';
import { ValidationControllerFactory, ValidationRules } from 'aurelia-validation';
import { CMRenderer } from '../common/cmRenderer';
import { validate } from '../common/cmValidate';
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

    controller = null;
    dialogService = null;

    constructor(controllerFactory, dialogService) {

        this.controller = controllerFactory.createForCurrentScope();
        this.controller.addRenderer(new CMRenderer());
        this.dialogService = dialogService;

    }

    submitRegistration() {

        const that = this;

        validate(this.controller).then(() => {

            register.submitRegistration(that.firstName,
                that.lastName,
                that.email,
                that.password).then(response => {

                    if (response.Data.result.registrationResult === 3) {

                        const modalModel = { title: "Success", message: "To complete the registration process, please verify your email address with instructions we just sent you." };

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

                    let errorMessage = "Unable to register.";

                    if (response.Data.result.registrationResult) {

                        switch (response.Data.result.registrationResult) {
                            case 0:
                                errorMessage = "Unable to register, email address is already registered.";
                                break;
                            case 1:
                                errorMessage = "Unable to register, failed to send registration email.";
                                break;
                            case 2:
                                errorMessage = "Unable to register, unable to create user.";
                                break;
                        }

                    }

                    const modalModel = { title: "Error", message: "It looks like you are logging in with this device for the first time.  For your security, we sent you an email with instructions on verifying this device before your are able to log in." };

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

ValidationRules
    .ensure('firstName').displayName("First Name").required()
    .ensure('lastName').displayName("Last Name").required()
    .ensure('email').displayName("Email Address").required().email()
    .ensure('password').displayName("Password").required().minLength(8).withMessage(`\${$displayName} must be 8 characters long.`)
    .ensure('password').displayName("Password").matches(/.*[A-Z]/).withMessage(`\${$displayName} contain an uppercase character.`)
    .ensure('password').displayName("Password").matches(/.*[0-9]/).withMessage(`\${$displayName} contain a number.`)
    .ensure('password').displayName("Password").matches(/.*[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/).withMessage(`\${$displayName} contain a special character.`)
    .on(Register);