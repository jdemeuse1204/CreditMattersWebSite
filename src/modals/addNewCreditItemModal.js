import { inject } from 'aurelia-dependency-injection';
import { DialogController } from 'aurelia-dialog';
import { find } from 'lodash';
import { lookup, management } from '../common/repository';
import * as loadingScreen from '../common/loadingScreen';
import { ValidationControllerFactory, ValidationRules } from 'aurelia-validation';
import { CMRenderer } from '../common/cmRenderer';
import { validateMultiple } from '../common/cmValidate';
import disputeReason from '../models/disputeReason';
import creditBureauEntry from '../models/creditBureauEntry';
import { isGuidEmpty, isNumeric } from "../common/utils"
import * as constants from '../constants';

@inject(DialogController, ValidationControllerFactory)
export class AddNewCreditItemModal {

    controller = null;
    validationController = null;
    model = null;
    creditBureauStatuses = [];
    creditors = [];
    adverseTypes = [];
    disputeReasons = [];
    isUsingCustomReason = false;
    customReason = "";
    rules = [];
    sendToCdsTransUnion = false;
    wasSentToCdsTransUnion = false;
    sendToCdsEquifax = false;
    wasSentToCdsEquifax = false;
    sendToCdsExperian = false;
    wasSentToCdsExperian = false;
    oldDisputeReasonId = 0;
    currentDisputeReason = "";

    constructor(controller, controllerFactory) {
        this.controller = controller;

        this.validationController = controllerFactory.createForCurrentScope();
        this.validationController.addRenderer(new CMRenderer());
    }

    attached() {

        const that = this;

        if (this.isUsingCustomReason === false && this.model.creditItem.AdverseTypeId) {

            this.populateDisputeReasons(this.model.creditItem.AdverseTypeId).then(response => {

                loadingScreen.hide();
            });

        } else {
            loadingScreen.hide();
        }
    }

    canDeactivate() {
        $("#manage-credit-items-validate-creditor input").val("");
        this.model.creditItem = new creditBureauEntry();
    }

    async activate(model) {

        this.isUsingCustomReason = model.creditItem.Dispute ? !model.creditItem.Dispute.IsDefault : false;

        if (this.isUsingCustomReason === true) {
            this.customReason = model.creditItem.Dispute.Reason;
        }

        this.model = model;
        this.sendToCdsTransUnion = false;
        this.wasSentToCdsTransUnion = constants.wasSentToCds(model.creditItem, constants.creditBureauIds.transUnion);
        this.sendToCdsEquifax = false;
        this.wasSentToCdsEquifax = constants.wasSentToCds(model.creditItem, constants.creditBureauIds.equifax);
        this.sendToCdsExperian = false;
        this.wasSentToCdsExperian = constants.wasSentToCds(model.creditItem, constants.creditBureauIds.experian);
        this.oldDisputeReasonId = this.model.creditItem.DisputeReasonId;

        this.creditBureauStatuses = await lookup.getCreditBureauStatuses();

        const creditorsResult = await lookup.getCreditors();
        const adverseTypesResult = await lookup.getAdverseTypes();

        this.transformResponseStatusIds();

        if (isGuidEmpty(this.model.creditItem.Id) === true) {
            this.creditBureauStatuses = this.filterStatusForAdd(this.creditBureauStatuses);
        } else {
            this.creditBureauStatuses = this.filterStatusForEdit(this.creditBureauStatuses);
        }

        this.creditors = creditorsResult.Data.result;
        this.adverseTypes = adverseTypesResult.Data.result;

        this.rules = ValidationRules
            .ensure('Balance').required().tag('core').satisfies(w => isNumeric(w))
            .ensure('AccountNumber').required().tag('core')
            .ensure('AdverseTypeId').satisfies(w => w > 0).withMessage('Please select Type').tag('core')
            .ensure('DisputeReasonId').satisfies(w => w > 0).withMessage('Please select Reason').tag('default')
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

        this.populateDisputeReasons(event.sender._old).then((response) => {

            that.model.creditItem.Dispute = null;
            that.model.creditItem.DisputeReasonId = response[0].Id;
            loadingScreen.hide();
        });
    }

    adverseTypeChange(event) {

        loadingScreen.show();
        this.populateDisputeReasons(this.model.creditItem.AdverseTypeId).then(() => {
            loadingScreen.hide();
        });
    }

    disputeReasonChange(event) {
        var reason = find(this.disputeReasons, { Id: this.model.creditItem.DisputeReasonId });

        if (!!reason) {
            this.currentDisputeReason = reason.Reason;
        }
    }

    usingCustomReasonChange(event) {

        if (this.isUsingCustomReason === false) {
            loadingScreen.show();
            this.populateDisputeReasons(this.model.creditItem.AdverseTypeId);
        }

    }

    populateDisputeReasons(adverseType) {

        const that = this;

        return lookup.getDisputeReasons(adverseType).then(response => {

            that.disputeReasons = response.Data.result;

        }).catch((error) => { });
    }

    showSendToCds() {
        this.model.display.sendingToCds = "";
        this.model.display.addEdit = "none";
        this.model.display.errorSendingToCds = "none";
    }

    sendToCds() {

        let creditBureaus = [];
        const that = this;
        // add status on CDS record for status, take it off of credit bureau entry..... maybe? Response status history table instead? I am thinking yes
        if (this.sendToCdsTransUnion) {
            creditBureaus.push(constants.creditBureauIds.transUnion);
        }

        if (this.sendToCdsExperian) {
            creditBureaus.push(constants.creditBureauIds.experian);
        }

        if (this.sendToCdsEquifax) {
            creditBureaus.push(constants.creditBureauIds.equifax);
        }

        loadingScreen.show();

        management.sendToCds(this.model.creditItem.Id, creditBureaus)
            .then((response) => {

                if (response.Data.success === true) {
                    that.model.display.sentToCds = "";
                    that.model.display.sendingToCds = "none";
                    that.model.display.addEdit = "none";
                    that.model.display.errorSendingToCds = "none";
                    that.model.display.approveDisputeReason = "none";
                    loadingScreen.hide();
                } else {
                    // send failed because its already added, show error message
                    that.model.display.sentToCds = "none";
                    that.model.display.sendingToCds = "none";
                    that.model.display.addEdit = "none";
                    that.model.display.approveDisputeReason = "none";
                    that.model.display.errorSendingToCds = "";
                }

            })
            .catch((error) => {
                loadingScreen.hide();
            });
    }

    backToAddEdit() {
        this.model.display.sendingToCds = "none",
            this.model.display.addEdit = "";
    }



    save() {

        let validateOptions = [];
        const that = this;
        const coreRules = ValidationRules.taggedRules(this.rules, 'core');
        const creditItemRule = ValidationRules.taggedRules(this.rules, 'creditItem');

        if (this.isUsingCustomReason === true) {

            this.model.creditItem.Dispute = new disputeReason();
            this.model.creditItem.Dispute.Id = 0;
            this.model.creditItem.Dispute.Reason = this.customReason;
            this.model.creditItem.Dispute.IsDefault = false;
            this.model.creditItem.Dispute.AdverseTypeId = this.model.creditItem.AdverseTypeId;
            this.model.creditItem.DisputeReasonId = 0;

            const customRules = ValidationRules.taggedRules(this.rules, 'custom');

            validateOptions = [{ object: this.model.creditItem, rules: coreRules },
            { object: this.model.creditItem.Creditor, rules: creditItemRule },
            { object: this, rules: customRules }];

        } else {

            const defaultRules = ValidationRules.taggedRules(this.rules, 'default');

            validateOptions = [{ object: this.model.creditItem, rules: coreRules },
            { object: this.model.creditItem.Creditor, rules: creditItemRule },
            { object: this.model.creditItem, rules: defaultRules }];
        }

        validateMultiple(this.validationController, validateOptions).then(() => {

            // check to see if dispute reason changed
            if (this.isUsingCustomReason === false && this.oldDisputeReasonId !== this.model.creditItem.DisputeReasonId) {
                // dispute reason has changed, ask user to verify it
                this.showDisputeReasonAcceptance(this);
                return;
            }

            this.transformResponseStatusIdsForSaving();

            loadingScreen.show();

            const that = this;
            this.model.creditItem.preSaveOps();

            management.saveCreditItem(this.model.creditItem).then(result => {
                that.controller.ok();
            }).finally(() => {
                loadingScreen.hide();
            });

        }).catch(() => { });
    }

    saveCreditItem() {
        loadingScreen.show();

        const that = this;
        this.model.creditItem.preSaveOps();

        management.saveCreditItem(this.model.creditItem).then(result => {

            management.approveDisputeReason(that.model.creditItem.DisputeReasonId, that.model.creditItem.Id).then(() => {
                that.controller.ok();
            }).finally(() => {
                loadingScreen.hide();
            })
        });
    }

    showDisputeReasonAcceptance(scope) {
        scope.model.display.sentToCds = "none";
        scope.model.display.sendingToCds = "none";
        scope.model.display.addEdit = "none";
        scope.model.display.approveDisputeReason = "";
        scope.model.display.errorSendingToCds = "none";
    }

    backToEdit() {
        scope.model.display.sentToCds = "none";
        scope.model.display.sendingToCds = "none";
        scope.model.display.addEdit = "";
        scope.model.display.approveDisputeReason = "none";
        scope.model.display.errorSendingToCds = "none";
    }

    filterStatusForAdd(items) {
        return items.filter(function (item) { return item.Type === 0 || item.Type === 1; });
    }

    filterStatusForEdit(items) {
        items.push({ Id: -1, Status: "Still Negative", Type: 2 });
        return items.filter(function (item) { return item.Type === 2; });
    }

    transformResponseStatusIds() {

        if (this.model.creditItem.TransUnionResponseStatusId == null) {
            this.model.creditItem.TransUnionResponseStatusId = -1;
        }

        if (this.model.creditItem.EquifaxResponseStatusId == null) {
            this.model.creditItem.EquifaxResponseStatusId = -1;
        }

        if (this.model.creditItem.ExperianResponseStatusId == null) {
            this.model.creditItem.ExperianResponseStatusId = -1;
        }
    }

    transformResponseStatusIdsForSaving() {

        if (this.model.creditItem.TransUnionResponseStatusId == -1) {
            this.model.creditItem.TransUnionResponseStatusId = null;
        }

        if (this.model.creditItem.EquifaxResponseStatusId == -1) {
            this.model.creditItem.EquifaxResponseStatusId = null;
        }

        if (this.model.creditItem.ExperianResponseStatusId == -1) {
            this.model.creditItem.ExperianResponseStatusId = null;
        }
    }
}