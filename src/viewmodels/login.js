import {useView} from 'aurelia-framework';
import {inject, NewInstance} from 'aurelia-dependency-injection';
import {ValidationController} from 'aurelia-validation';

@useView('../views/login.html')
@inject(NewInstance.of(ValidationController))
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

    constructor(controller) {
        this.controller = controller;
debugger;
        ValidationRules.ensure('username').required().when(controller => controller.submit);
    }

    submit() {
        
        var result = this.controller.validate();

    }

    verifyPin() {

    }
}