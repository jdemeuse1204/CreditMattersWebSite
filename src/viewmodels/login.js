import { useView } from 'aurelia-framework';
import { inject, NewInstance } from 'aurelia-dependency-injection';
import { ValidationControllerFactory, ValidationController, ValidationRules } from 'aurelia-validation';
import { CMRenderer } from '../common/cmRenderer';
import {validate} from '../common/cmValidate';
import {login} from '../common/authorization';
import {loginResults} from '../constants';
import {account} from '../common/repository';

@inject(ValidationControllerFactory)
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

    constructor(controllerFactory) {
        this.controller = controllerFactory.createForCurrentScope();
        this.controller.addRenderer(new CMRenderer());
    }

    submit() {

        const loginRules = ValidationRules.taggedRules(this.rules, 'login');
        const that = this;

        validate(this.controller, { object: this, rules: loginRules }).then(() => {
            
            login(this.username, this.password, this.rememberMe)
            .then((message, token, firstName, addressCompletedDateTime) => {
                debugger;
            })
            .catch((result) => {

                switch(result){
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