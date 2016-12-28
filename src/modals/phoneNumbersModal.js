import { inject } from 'aurelia-dependency-injection';
import { DialogController } from 'aurelia-dialog';
import { lookup, management } from '../common/repository';
import * as loadingScreen from '../common/loadingScreen';
import { ValidationControllerFactory, ValidationRules } from 'aurelia-validation';
import { CMRenderer } from '../common/cmRenderer';
import { validateMultiple } from '../common/cmValidate';
import { isNumeric } from '../common/utils';

@inject(DialogController, ValidationControllerFactory)
export class PhoneNumbersModal {

    controller = null;
    validationController = null;
    model = null;
    rules = [];

    constructor(controller, controllerFactory) {
        this.controller = controller;

        this.validationController = controllerFactory.createForCurrentScope();
        this.validationController.addRenderer(new CMRenderer());
    }

    attached() {


    }

    async activate(model) {

        this.model = model

        this.rules = ValidationRules
            .ensure('homePhoneNumber').required().satisfies(w => isNumeric(w) && w.length === 10)
            .ensure('workPhoneNumber').required().satisfies(w => isNumeric(w) && w.length === 10)
            .ensure('mobilePhoneNumber').required().satisfies(w => isNumeric(w) && w.length === 10)
            .on(this.model)
            .rules;
    }

    save(){

    }
}