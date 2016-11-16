import {useView} from 'aurelia-framework';
import { inject } from 'aurelia-dependency-injection';
import {DialogController} from 'aurelia-dialog';

@inject(DialogController)
export class Confirm {

    controller = null;
    model = null;

    constructor(controller) {
        this.controller = controller;
    }

    activate(model) {
        this.model = model
    }
}