import { useView } from 'aurelia-framework';
import { inject, NewInstance } from 'aurelia-dependency-injection';
import { ValidationControllerFactory, ValidationController, ValidationRules } from 'aurelia-validation';
import { CMRenderer } from '../common/cmRenderer';

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

    rememberMe = false;
    controller = null;

    constructor(controllerFactory) {
        this.controller = controllerFactory.createForCurrentScope();
        this.controller.addRenderer(new CMRenderer());
    }

    submit() {
        
        this.controller.validate().then(errors => {
            if (errors.length === 0) {
                // all good
            }
        });
    }

    verifyPin() {

    }
}

ValidationRules
    .ensure('username').required()
    .ensure('password').required()
    .on(Login);