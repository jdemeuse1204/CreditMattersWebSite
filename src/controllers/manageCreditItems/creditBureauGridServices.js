/* beautify preserve:start */
import { management } from '../../common/repository';
import * as loadingScreen from '../../common/loadingScreen';
import creditBureauEntry from '../../models/creditBureauEntry';
import { inject } from 'aurelia-dependency-injection';
import { DialogService } from 'aurelia-dialog';
/* beautify preserve:end */

@inject(DialogService)
export class GridServices {

  dialogService = null;

  constructor(dialogService) {
    this.dialogService = dialogService;
  }

  openModal(id, creditBureau) {
    return new Promise((resolve, reject) => {
      loadingScreen.show();

      let cbe = null;
      const that = this;
      const modalModel = {
        title: 'Edit Response',
        creditItemId: id,
        creditBureau: creditBureau
      };

      that.dialogService.open({
        viewModel: 'modals/creditItemResponseModal',
        model: modalModel
      }).then(response => {
        resolve(response);
      }).catch(error => {
        reject(error);
      });
    });
  }
}
