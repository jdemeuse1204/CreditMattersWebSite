import "bootstrap";

import { useView } from 'aurelia-framework';
import { MainGrid } from '../../controllers/manageCreditItems/mainGrid';
import { inject } from 'aurelia-dependency-injection';
import * as loadingScreen from "../../common/loadingScreen";
import { GridServices } from '../../controllers/manageCreditItems/gridServices';

@useView('../../views/management/manageCreditItems.html')
@inject(MainGrid, GridServices)
export class ManageCreditItems {

    mainGrid = null;
    gridServices = null;

    constructor(mainGrid, gridServices) {
        this.mainGrid = mainGrid;
        this.gridServices = gridServices;
    }

    attached() {

        loadingScreen.show();

        this.mainGrid.load().then(() => {
            loadingScreen.hide();
        });
    }

    addItem() {

        const that = this;

        this.gridServices.openModal().then(response => {

            if (response.wasCancelled === false) {
                that.mainGrid.load();
            }
        }).catch(() => {});
    }

    createLetter() {

        if (this.mainGrid.anyItemsSelected() === false) {
            return;
        }
    }
}
