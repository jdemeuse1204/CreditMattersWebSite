import "bootstrap";

import { useView } from 'aurelia-framework';
import { Grid } from '../../controllers/manageCreditItems/grid';
import { inject } from 'aurelia-dependency-injection';
import { DialogService } from 'aurelia-dialog';
import * as loadingScreen from "../../common/loadingScreen";
import { GridServices } from '../../controllers/manageCreditItems/gridServices';

@useView('../../views/management/manageCreditItems.html')
@inject(Grid, GridServices, DialogService)
export class ManageCreditItems {

    Grid = null;
    gridServices = null;
    dialogController = null;

    constructor(grid, gridServices, dialogController) {
        this.grid = grid;
        this.gridServices = gridServices;
        this.dialogController = dialogController;
    }

    attached() {

        loadingScreen.show();

        this.grid.load().then(() => {

        }).catch(error => {
            
        }).finally(() => {
            loadingScreen.hide();
        });
    }

    addItem() {

        const that = this;

        this.gridServices.openModal().then(response => {

            if (response.wasCancelled === false) {
                that.grid.load();
            }
        }).catch(() => { });
    }

    createLetter() {

        loadingScreen.show();

        const modalModel = {
            display: {
                stepOne: "",
                stepTwo: "none",
                stepThree: "none",
                stepFour: "none",
                footer: "none"
            },
            creditBureau: ""
        };

        this.dialogController.open({
            viewModel: 'modals/createDisputeLetterFromManageCreditItemsModal',
            model: modalModel
        }).then(response => {

            if (response.wasCancelled === false) {

            }
        }).catch(error => {

        });
    }
}
