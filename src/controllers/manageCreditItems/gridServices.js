import { management } from "../../common/repository";
import * as loadingScreen from "../../common/loadingScreen";
import creditBureauEntry from "../../models/creditBureauEntry";
import { inject } from 'aurelia-dependency-injection';
import { DialogService } from 'aurelia-dialog';
import { isGuidEmpty } from '../../common/utils';

@inject(DialogService)
export class GridServices {

    dialogService = null;

    constructor(dialogService) {
        this.dialogService = dialogService;
    }

    openModal(id) {

        return new Promise((resolve, reject) => {

            loadingScreen.show();

            let cbe = null;
            const that = this;
            const renderModal = function (item) {

                const isNewItem = isGuidEmpty(item.Id) === true;

                const addOrEdit = isNewItem === true ? "Add" : "Edit";
                const modalModel = {
                    title: `${addOrEdit} Credit Item`,
                    creditItem: item,
                    display: {
                        defaultDisputeReason: "none",
                        add: isNewItem ? "" : "none",
                        edit: isNewItem ? "none" : ""
                    }
                };

                that.dialogService.open({
                    viewModel: 'modals/addNewCreditItemModal',
                    model: modalModel
                }).then(response => {
                    resolve(response);
                }).catch(error => {
                    reject(error);
                });
            };

            if (id) {

                management.getCreditItem(id).then(function (result) {

                    cbe = new creditBureauEntry(result);

                    renderModal(cbe);
                });
                return;
            }

            cbe = new creditBureauEntry();

            renderModal(cbe);
        });
    }
}

