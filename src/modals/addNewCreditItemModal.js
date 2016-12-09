import { useView } from 'aurelia-framework';
import { inject } from 'aurelia-dependency-injection';
import { DialogController } from 'aurelia-dialog';
import { lookup } from '../common/repository';
import * as loadingScreen from '../common/loadingScreen';

@inject(DialogController)
export class AddNewCreditItemModal {

    controller = null;
    model = null;
    creditBureauStatuses = [];
    creditors = [];
    adverseTypes = [];

    constructor(controller) {
        this.controller = controller;
    }

    async activate(model) {

        this.model = model

        this.creditBureauStatuses = await lookup.getCreditBureauStatuses();

        const creditorsResult = await lookup.getCreditors();
        const adverseTypesResult = await lookup.getAdverseTypes();

        this.creditors = creditorsResult.Data.result;
        this.adverseTypes = adverseTypesResult.Data.result;

        loadingScreen.hide();
    }

    save() {
debugger;
    }
}