import { inject } from 'aurelia-dependency-injection';
import {DialogController} from 'aurelia-dialog';
import * as loadingScreen from '../common/loadingScreen';
import { lookup } from '../common/repository';

@inject(DialogController)
export class EditCdsItemModal {

    controller = null;
    model = null;
    responses = [];

    constructor(controller) {
        this.controller = controller;
    }

    async activate(model) {
        this.model = model;

        this.responses = await lookup.getCreditBureauStatuses();
debugger;
    }

    attached() {
        loadingScreen.hide();
    }
}