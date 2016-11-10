import { useView } from 'aurelia-framework';
import { DialogService } from 'aurelia-dialog';
import { inject, NewInstance } from 'aurelia-dependency-injection';
import { ValidationControllerFactory, ValidationController, ValidationRules } from 'aurelia-validation';
import { CMRenderer } from '../common/cmRenderer';
import { validate } from '../common/cmValidate';
import { login } from '../common/authorization';
import { loginResults } from '../constants';
import { account } from '../common/repository';

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

    submit() {

        const modalModel = { title: "test", message: "test" };

        this.dialogService.open({ viewModel: 'modals/confirm', model: modalModel }).then(response => {
            debugger;
            if (!response.wasCancelled) {
                console.log('good - ', response.output);
            } else {
                console.log('bad');
            }
            console.log(response.output);
        });
        return;

        const loginRules = ValidationRules.taggedRules(this.rules, 'login');
        const that = this;

        validate(this.controller, { object: this, rules: loginRules }).then(() => {

            login(this.username, this.password, this.rememberMe)
                .then((message, token, firstName, addressCompletedDateTime) => {
                    debugger;
                })
                .catch((result) => {
                    debugger;
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
                            debugger;

                            account.sendAuthorizationCode(that.username);

                            const modalModel = { title: "test", message: "test" };

                            that.dialogService.open({ viewModel: 'Confrim', model: modalModel }).then(response => {
                                debugger;
                                if (!response.wasCancelled) {
                                    console.log('good - ', response.output);
                                } else {
                                    console.log('bad');
                                }
                                console.log(response.output);
                            });
                            break;
                    }

                });

        }).catch(() => {
            debugger;
        });
    }

    verifyPin() {

    }
}