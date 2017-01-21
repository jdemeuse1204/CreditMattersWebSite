import { useView } from 'aurelia-framework';
import { DialogService } from 'aurelia-dialog';
import { inject } from 'aurelia-dependency-injection';
import { ValidationControllerFactory, ValidationRules } from 'aurelia-validation';
import { CMRenderer } from '../common/cmRenderer';
import { validate } from '../common/cmValidate';
import * as authorization from '../common/authorization';
import { loginResults, routes } from '../constants';
import { account } from '../common/repository';
import * as loadingScreen from "../common/loadingScreen";

@inject(ValidationControllerFactory, DialogService)
@useView('../views/login.html')
export class Login {

    loginMessageDisplay = "none";
    loginMessage = "";
    pinDisplay = "none";
    pin = "";
    loginDisplay = "block";

    username = "";
    password = "";

    rules = ValidationRules
        .ensure('username').required().tag('login')
        .ensure('password').required().tag('login')
        .ensure('pin').required().tag('verifyPin')
        .on(Login)
        .rules;

    rememberMe = false;
    controller = null;
    dialogService = null;

    constructor(controllerFactory, dialogService) {

        this.controller = controllerFactory.createForCurrentScope();
        this.controller.addRenderer(new CMRenderer());
        this.dialogService = dialogService;

    }

    clearLoginMessage() {
        this.loginMessageDisplay = "none";
    }

    resendRegistrationEmail() {

        const modalModel = {
            display: {
                error: "none",
                success: "none",
                email: ""
            },
            errorText: "",
            emailAddress: this.username
        };

        this.dialogService.open({ viewModel: 'modals/resendRegistrationEmail', model: modalModel });
    }

    forgotUsername() {

        const modalModel = {
            emailAddress: this.username,
            display: {
                initialStep: "",
                emailAddress: "none",
                phoneNumber: "none"
            }
        };

        this.dialogService.open({ viewModel: 'modals/forgotUsernameModal', model: modalModel });
    }

    submit() {

        const loginRules = ValidationRules.taggedRules(this.rules, 'login');
        const that = this;

        this.clearLoginMessage();

        validate(this.controller, { object: this, rules: loginRules }).then(() => {

            loadingScreen.show();

            authorization.login(this.username, this.password, this.rememberMe).then(response => {

                authorization.setAuthorizationToken(response.token);
                window.location.href = routes.manageCreditItems;

            }).catch((result) => {

                switch (result) {
                    default:
                    case loginResults.failed:
                        that.loginMessage = "Username or password incorrect.";
                        that.loginMessageDisplay = "block";
                        break;
                    case loginResults.lockedOut:
                        that.loginMessage = "Account is locked.";
                        that.loginMessageDisplay = "block";
                        break;
                    case loginResults.requiresVerification:

                        break;
                    case loginResults.hasTemporaryPassword:

                        break;
                    case loginResults.requiresDeviceVerification:

                        account.sendAuthorizationCode(that.username);

                        const modalModel = { 
                            title: "Device Verification Required", 
                            message: "It looks like you are logging in with this device for the first time.  For your security, we sent you an email with instructions on verifying this device before your are able to log in." 
                        };

                        that.dialogService.open({ viewModel: 'modals/confirm', model: modalModel }).then(response => {
                            that.pinDisplay = "";
                            that.loginDisplay = "none";
                        });
                        break;
                }

            }).finally(() => {
                loadingScreen.hide();
            });

        }).catch(() => {

        });
    }

    verifyPin() {

        const that = this;

        this.clearLoginMessage();

        validate(this.controller).then(() => {

            loadingScreen.show();

            account.verifyVerificationCode(this.username, this.password, this.pin).then(response => {

                if (response.Data.result.Success === true) {

                    authorization.setDeviceAuthorizationToken(response.Data.result.DeviceAuthorizationToken);
                    authorization.setAuthorizationToken(response.Data.result.Token);
                    window.location.href = routes.manageCreditItems;

                    return;
                }

                that.loginMessage = "PIN incorrect";
                that.loginMessageDisplay = "block";
            }).finally(() => {
                loadingScreen.hide();
            });

        });
    }
}