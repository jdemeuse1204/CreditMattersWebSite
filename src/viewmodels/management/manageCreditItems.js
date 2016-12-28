import "bootstrap";

import { useView } from 'aurelia-framework';
import { Grid } from '../../controllers/manageCreditItems/grid';
import { inject } from 'aurelia-dependency-injection';
import * as loadingScreen from "../../common/loadingScreen";
import { GridServices } from '../../controllers/manageCreditItems/gridServices';

@useView('../../views/management/manageCreditItems.html')
@inject(Grid, GridServices)
export class ManageCreditItems {

    Grid = null;
    gridServices = null;

    constructor(grid, gridServices) {
        this.grid = grid;
        this.gridServices = gridServices;
    }

    attached() {

        loadingScreen.show();

        this.grid.load().then(() => {
            loadingScreen.hide();
        });
    }

    addItem() {

        const that = this;

        this.gridServices.openModal().then(response => {

            if (response.wasCancelled === false) {
                that.grid.load();
            }
        }).catch(() => {});
    }

    createLetter() {

        if (this.grid.anyItemsSelected() === false) {
            return;
        }
    }
}
