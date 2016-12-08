import "bootstrap";

import { useView } from 'aurelia-framework';
import { MainGrid } from '../../controllers/manageCreditItems/mainGrid';
import { inject } from 'aurelia-dependency-injection';
import * as loadingScreen from "../../common/loadingScreen";

@useView('../../views/management/manageCreditItems.html')
@inject(MainGrid)
export class ManageCreditItems {

    mainGrid = null;

    constructor(mainGrid) {
        this.mainGrid = mainGrid;
    }

    attached() {
        
        loadingScreen.show();

        this.mainGrid.load().then(() => {
            loadingScreen.hide();
        });
    }

    addItem() {
        this.mainGrid.addItemClick();
    }

    createLetter() {

        if (this.mainGrid.anyItemsSelected() === false) {
            return;
        }
    }
}
