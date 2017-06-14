/* beautify preserve:start */
import 'bootstrap';
import '../../styles/index.less';
import '../../styles/management/equifaxCreditItems.less';
import { useView } from 'aurelia-framework';
import { EquifaxGrid } from '../../controllers/manageCreditItems/equifaxGrid';
import { inject } from 'aurelia-dependency-injection';
import * as loadingScreen from '../../common/loadingScreen';
import { PLATFORM } from 'aurelia-pal';
/* beautify preserve:end */

@useView(PLATFORM.moduleName('../../views/management/equifaxCreditItems.html'))
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
