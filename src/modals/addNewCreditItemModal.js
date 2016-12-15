import { useView } from 'aurelia-framework';
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
    creditBureauStatuses = [];
    creditors = [];
    adverseTypes = [];
    isUsingCustomReason = false;
    customReason = "";
    rules = [];

    constructor(controller, controllerFactory) {
        this.controller = controller;

        this.validationController = controllerFactory.createForCurrentScope();
        this.validationController.addRenderer(new CMRenderer());
    }

    attached() {

        if (this.isUsingCustomReason === false && this.model.creditItem.AdverseTypeId) {

            this.populateDisputeReasons(this.model.creditItem.AdverseTypeId).then(response => {
                loadingScreen.hide();
            });

        }

        loadingScreen.hide();
    }

    async activate(model) {

        this.isUsingCustomReason = model.creditItem.Dispute ? !model.creditItem.Dispute.IsDefault : false;

        if (this.isUsingCustomReason === true) {

        }

        this.model = model
        this.creditBureauStatuses = await lookup.getCreditBureauStatuses();

        const creditorsResult = await lookup.getCreditors();
        const adverseTypesResult = await lookup.getAdverseTypes();

        this.creditors = creditorsResult.Data.result;
        this.adverseTypes = adverseTypesResult.Data.result;

        this.rules = ValidationRules
            .ensure('Balance').required().satisfies(w => !isNaN(parseFloat(w)) && isFinite(w)).tag('core')
            .ensure('AccountNumber').required().tag('core')
            .ensure('AdverseTypeId').satisfies(w => w !== 0).withMessage('Please select Type').tag('core')
            .ensure('DisputeReasonId').satisfies(w => w !== 0).withMessage('Please select Reason').tag('default')
            .on(this.model.creditItem)
            .ensure('Name').required().tag('core')
            .on(this.model.creditItem.Creditor)
            .ensure('customReason').required().tag('custom')
            .on(AddNewCreditItemModal)
            .rules;
    }

    typeChange(event) {
        loadingScreen.show();

        const that = this;

        this.populateDisputeReasons(event.sender._old).then(response => {
            loadingScreen.hide();
        });
    }

    populateDisputeReasons(adverseType) {

        return lookup.getDisputeReasons(adverseType).then(response => {

            const element = $("#manage-credit-items-default-dispute-reason-default-ddl ak-drop-down-list").data("kendoDropDownList");

            element.dataSource.data(response.Data.result);
            element.dataSource.transport.data = response.Data.result;

        });
    }

    save() {

        let validateOptions = [];
        const coreRules = ValidationRules.taggedRules(this.rules, 'core');

        if (this.isUsingCustomReason === true) {

            const customRules = ValidationRules.taggedRules(this.rules, 'custom');

            validateOptions = [{ object: this, rules: coreRules }, { object: this, rules: customRules }];
        } else {
            
            const defaultRules = ValidationRules.taggedRules(this.rules, 'default');

            validateOptions = [{ object: this, rules: coreRules }, { object: this, rules: defaultRules }];
        }


        validateMultiple(this.validationController, validateOptions).then(() => {
            debugger;
            loadingScreen.show();
            management.saveCreditItem(this.model.creditItem).then(result => {

            }).finally(() => {
                loadingScreen.hide();
            });
        }).catch(() => { }); 
    }
}