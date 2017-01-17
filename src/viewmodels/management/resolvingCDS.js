import "bootstrap";

import { useView } from 'aurelia-framework';
import { Grid } from '../../controllers/resolvingCDS/grid';
import { inject } from 'aurelia-dependency-injection';
import * as loadingScreen from "../../common/loadingScreen";
import { GridServices } from '../../controllers/resolvingCDS/gridServices';

@useView('../../views/management/resolvingCDS.html')
@inject(Grid, GridServices)
export class ResolvingCDS {

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
}
