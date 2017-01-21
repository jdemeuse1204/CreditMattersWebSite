import { inject } from 'aurelia-dependency-injection';
import {DialogController} from 'aurelia-dialog';

@inject(DialogController)
export class RegisterResultModal {

    controller = null;
    model = null;

    constructor(controller) {
        this.controller = controller;
    }

    activate(model) {
        this.model = model
    }

    login() {
        window.location = "#/Login"
    }

    recoverPassword() {

    }

    resendAuthorizationEmail() {
        
    }
}