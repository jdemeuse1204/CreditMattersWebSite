/* beautify preserve:start */
import 'bootstrap';
import { useView } from 'aurelia-framework';
import { ExperianGrid } from '../../controllers/manageCreditItems/experianGrid';
import { inject } from 'aurelia-dependency-injection';
import * as loadingScreen from '../../common/loadingScreen';
import { PLATFORM } from 'aurelia-pal';
/* beautify preserve:end */

@useView(PLATFORM.moduleName('../../views/management/experianCreditItems.html'))
@inject(ExperianGrid)
export class ExperianCreditItems {

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
