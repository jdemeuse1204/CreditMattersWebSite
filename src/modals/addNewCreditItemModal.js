import { useView } from 'aurelia-framework';
import { inject } from 'aurelia-dependency-injection';
import { DialogController } from 'aurelia-dialog';
import { lookup, management } from '../common/repository';
import * as loadingScreen from '../common/loadingScreen';
import { ValidationControllerFactory, ValidationRules } from 'aurelia-validation';
import { CMRenderer } from '../common/cmRenderer';
import { validateMultiple } from '../common/cmValidate';
import disputeReason from '../models/disputeReason';

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

        const that = this;

        if (this.isUsingCustomReason === false && this.model.creditItem.AdverseTypeId) {

            this.populateDisputeReasons(this.model.creditItem.AdverseTypeId).then(response => {

                const element = $("#manage-credit-items-default-dispute-reason-default-ddl ak-drop-down-list").data("kendoDropDownList");
                // after the element is bound the dispute reason id is being updated and is not correct
                that.model.creditItem.DisputeReasonId = that.model.creditItem.Dispute.Id;

                element.value(that.model.creditItem.DisputeReasonId);
                loadingScreen.hide();
            });

        } else {
            loadingScreen.hide();
        }
    }

    async activate(model) {

        this.isUsingCustomReason = model.creditItem.Dispute ? !model.creditItem.Dispute.IsDefault : false;
        this.model = model
        this.creditBureauStatuses = await lookup.getCreditBureauStatuses();

        const creditorsResult = await lookup.getCreditors();
        const adverseTypesResult = await lookup.getAdverseTypes();

        this.creditors = creditorsResult.Data.result;
        this.adverseTypes = adverseTypesResult.Data.result;

        this.rules = ValidationRules
            .ensure('Balance').required().tag('core').satisfies(w => !isNaN(parseFloat(w)) && isFinite(w))
            .ensure('AccountNumber').required().tag('core')
            .ensure('AdverseTypeId').satisfies(w => w !== 0).withMessage('Please select Type').tag('core:kendoDropDownList')
            .ensure('DisputeReasonId').satisfies(w => w !== 0).withMessage('Please select Reason').tag('default')
            .on(this.model.creditItem)
            .ensure('Name').required().tag('creditItem')
            .on(this.model.creditItem.Creditor)
            .ensure('customReason').required().tag('custom')
            .on(AddNewCreditItemModal)
            .rules;
    }

    typeChange(event) {

        if (this.isUsingCustomReason) { return; }
        loadingScreen.show();

        const that = this;

        this.populateDisputeReasons(event.sender._old).then(response => {
            loadingScreen.hide();
        });
    }

    usingCustomReasonChange(event) {

        if (this.isUsingCustomReason === false) {
            loadingScreen.show();
            this.populateDisputeReasons(this.model.creditItem.AdverseTypeId).then(() => {
                const element = $("#manage-credit-items-default-dispute-reason-default-ddl ak-drop-down-list").data("kendoDropDownList");

                if (!!this.model.creditItem.Dispute.Id) {
                    element.value(this.model.creditItem.Dispute.Id);
                    loadingScreen.hide();
                }
            });
        }

    }

    populateDisputeReasons(adverseType) {

        return lookup.getDisputeReasons(adverseType).then(response => {

            const element = $("#manage-credit-items-default-dispute-reason-default-ddl ak-drop-down-list").data("kendoDropDownList");

            if (!!element) {
                element.dataSource.data(response.Data.result);
                element.dataSource.transport.data = response.Data.result;
            }
        });
    }

    save() {

        let validateOptions = [];
        const that = this;
        const coreRules = ValidationRules.taggedRules(this.rules, 'core');
        const coreKendoDropDowns = ValidationRules.taggedRules(this.rules, 'core:kendoDropDownList');
        const creditItemRule = ValidationRules.taggedRules(this.rules, 'creditItem');

        if (this.isUsingCustomReason === true) {

            this.model.creditItem.Dispute = new disputeReason();
            this.model.creditItem.Dispute.Reason = this.customReason;
            this.model.creditItem.Dispute.IsDefault = false;
            this.model.creditItem.DisputeReasonId = 0;

            const customRules = ValidationRules.taggedRules(this.rules, 'custom');

            validateOptions = [{ object: this.model.creditItem, rules: coreRules },
            { object: this.model.creditItem, rules: coreKendoDropDowns },
            { object: this.model.creditItem.Creditor, rules: creditItemRule },
            { object: this, rules: customRules }];
        } else {

            const defaultRules = ValidationRules.taggedRules(this.rules, 'default');

            validateOptions = [{ object: this.model.creditItem, rules: coreRules },
            { object: this.model.creditItem, rules: coreKendoDropDowns },
            { object: this.model.creditItem.Creditor, rules: creditItemRule },
            { object: this.model.creditItem, rules: defaultRules }];
        }


        validateMultiple(this.validationController, validateOptions).then(() => {

            loadingScreen.show();
            management.saveCreditItem(this.model.creditItem).then(result => {
                that.controller.ok();
            }).finally(() => {
                loadingScreen.hide();
            });

        }).catch(() => { });
    }
}