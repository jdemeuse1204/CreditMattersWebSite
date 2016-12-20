import { inject } from 'aurelia-dependency-injection';
import { DialogController } from 'aurelia-dialog';
import { lookup, management } from '../common/repository';
import * as loadingScreen from '../common/loadingScreen';
import { ValidationControllerFactory, ValidationRules } from 'aurelia-validation';
import { CMRenderer } from '../common/cmRenderer';
import { validateMultiple } from '../common/cmValidate';

@inject(DialogController, ValidationControllerFactory)
export class AddNewCreditItemModal {

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
        this.creditBureauStatuses = await lookup.getCreditBureauStatuses();

        const creditorsResult = await lookup.getCreditors();
        const adverseTypesResult = await lookup.getAdverseTypes();

        this.rules = ValidationRules
            .ensure('Balance').required().tag('core').satisfies(w => !isNaN(parseFloat(w)) && isFinite(w))
            .ensure('AccountNumber').required().tag('core')
            .ensure('AdverseTypeId').satisfies(w => w > 0).withMessage('Please select Type').tag('core:kendoDropDownList')
            .on(this.model.creditItem)
            .ensure('DisputeReasonId').satisfies(w => w > 0).withMessage('Please select Reason').tag('default:kendoDropDownList')
            .on(this.model.creditItem)
            .ensure('Name').required().tag('creditItem')
            .on(this.model.creditItem.Creditor)
            .ensure('customReason').required().tag('custom')
            .on(AddNewCreditItemModal)
            .rules;
    }

    save(){

    }
}