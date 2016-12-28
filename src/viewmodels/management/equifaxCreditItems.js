import "bootstrap";

import { useView } from 'aurelia-framework';
import { EquifaxGrid } from '../../controllers/manageCreditItems/equifaxGrid';
import { inject } from 'aurelia-dependency-injection';
import * as loadingScreen from "../../common/loadingScreen";

@useView('../../views/management/equifaxCreditItems.html')
@inject(EquifaxGrid)
export class EquifaxCreditItems {

    grid = null;

    constructor(grid) {
        this.grid = grid;
    }

    attached() {

        loadingScreen.show();

        this.grid.load().then(() => {
            loadingScreen.hide();
        });
    }

    createLetter() {

        if (this.grid.anyItemsSelected() === false) {
            return;
        }
    }
}
