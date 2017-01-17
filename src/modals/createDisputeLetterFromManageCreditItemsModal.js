import { inject } from 'aurelia-dependency-injection';
import { DialogController } from 'aurelia-dialog';
import { management } from '../common/repository';
import * as loadingScreen from '../common/loadingScreen';
import { getTemplateHtml } from "../common/utils";
import * as constants from '../constants';
import { find } from 'lodash';

@inject(DialogController)
export class CreateDisputeLetterFromManageCreditItemsModal {

    controller = null;
    model = null;
    activeStep = 1;
    steps = ["stepOne", "stepTwo", "stepThree", "stepFour"];
    table = null;
    data = [];

    constructor(controller, controllerFactory) {
        this.controller = controller;
    }

    attached() {
        loadingScreen.hide();
    }

    activate(model) {
        this.model = model;
    }

    showStep(stepNumber) {
        this.activeStep = stepNumber;
        this.model.display.footer = stepNumber === 1 ? "none" : "";

        if (stepNumber === 4) {

            const that = this;

            if (!that.table) {
                loadingScreen.show();
                management.getCreditItemsThatNeedDisputeReasonAcceptance(this.model.creditBureau).then((response) => {

                    let mobileTemplate = kendo.template(getTemplateHtml("#credit-item-dispute-reason-acceptance"));
                    that.data = response.Data.result;

                    that.table = $("#accept-dispute-reasons-table").DataTable({
                        data: that.data,
                        columns: [
                            {
                                title: "Credit Items",
                                data: "Id",
                                render: function (e) {
                                    const item = find(that.data, function (i) { return i.Id === e; });
                                    if (!item) { debugger; }
                                    item.Balance = kendo.toString(item.Balance, "c2");

                                    return mobileTemplate(item);
                                }
                            }
                        ],
                        scrollY: '50vh',
                        scrollCollapse: true,
                        paging: false,
                        initComplete: function () {

                            const items = $("#accept-dispute-reasons-table_wrapper > div.row .col-sm-6");

                            // remove search bar
                            $(items[0]).remove();
                            $(items[1]).remove();

                            loadingScreen.hide();
                        }
                    });
                });
            }

        }

        for (let i = 1; i < this.steps.length + 1; i++) {
            const step = this.steps[i - 1];
            this.model.display[step] = i === stepNumber ? "" : "none";
        }
    }

    back() {
        this.showStep(this.activeStep - 1);
    }

    /// Step One
    stepOneTransUnion() {
        this.model.creditBureau = constants.creditBureaus.transUnion;
        this.showStep(this.activeStep + 1);
    }

    stepOneEquifax() {
        this.model.creditBureau = constants.creditBureaus.equifax;
        this.showStep(this.activeStep + 1);
    }

    stepOneExperian() {
        this.model.creditBureau = constants.creditBureaus.experian;
        this.showStep(this.activeStep + 1);
    }

    /// Step Two
    selectAllItems() {

        this.showStep(this.activeStep + 2);
    }

    chooseSpecificItems() {
        this.showStep(this.activeStep + 1);
    }


}