import { inject } from 'aurelia-dependency-injection';
import { DialogController } from 'aurelia-dialog';
import { management } from '../common/repository';
import * as loadingScreen from '../common/loadingScreen';
import * as constants from '../constants';

@inject(DialogController)
export class CreditItemResponseModal {

    controller = null;
    model = null;

    constructor(controller, controllerFactory) {
        this.controller = controller;
    }

    attached() {
        loadingScreen.hide();
    }

    activate(model) {
        this.model = model;
    }

    markAsPositive() {
        const that = this;
        management.changeCreditItemResponse(this.model.creditBureau, constants.creditBureauStatuses.positive, this.model.creditItemId).then(() => {
            that.controller.ok();
        });
    }

    markAsDeleted() {
        const that = this;
        management.changeCreditItemResponse(this.model.creditBureau, constants.creditBureauStatuses.deleted, this.model.creditItemId).then(() => {
            that.controller.ok();
        });
    }

    markAsNoResponse() {
        const that = this;
        management.changeCreditItemResponse(this.model.creditBureau, constants.creditBureauStatuses.na, this.model.creditItemId).then(() => {
            that.controller.ok();
        });
    }
}