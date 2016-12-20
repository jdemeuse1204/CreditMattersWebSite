import { inject } from 'aurelia-dependency-injection';
import {DialogController} from 'aurelia-dialog';
import {register} from '../common/repository';

@inject(DialogController)
export class SecurityQuestions {

    controller = null;
    model = null;
    securityQuestions = [];

    constructor(controller) {
        this.controller = controller;
    }

    async activate(model) {
        let response = await register.getSecurityQuestions();

        this.model = model
        this.securityQuestions = response.Data.result;
    }
}