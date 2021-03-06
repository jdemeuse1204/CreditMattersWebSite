import "bootstrap";

import { useView } from 'aurelia-framework';
import { TransUnionGrid } from '../../controllers/manageCreditItems/transUnionGrid';
import { inject } from 'aurelia-dependency-injection';
import * as loadingScreen from "../../common/loadingScreen";

@useView('../../views/management/transUnionCreditItems.html')
@inject(TransUnionGrid)
export class TransUnionCreditItems {

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
