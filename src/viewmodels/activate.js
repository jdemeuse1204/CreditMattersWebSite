import { useView } from 'aurelia-framework';
import { inject } from 'aurelia-dependency-injection';
import { DialogService } from 'aurelia-dialog';
import { register } from '../common/repository';
import * as loadingScreen from '../common/loadingScreen';
import { setAuthorizationToken } from '../common/authorization';
import { loginResults, routes } from '../constants';

@useView('../views/activate.html')
@inject(DialogService)
export class Activate {

    params = [];
    dialogService = null;

    constructor(dialogService) {
        this.dialogService = dialogService;
    }

    attached() {

        const that = this;
        let modalModel = {
            display: {
                success: "",
                fail: "none"
            },
            title: "",
            message: ""
        };
        let promise = new Promise((resolve, reject) => {

            if (!!that.params.uid) {

                loadingScreen.show();
                register.authorizeUser(that.params.uid).then((response) => {

                    if (response.Data.success === true) {
                        resolve(response.Data.result);
                    } else {
                        reject();
                    }

                }).catch((error) => {
                    reject();
                }).finally(() => {
                    loadingScreen.hide();
                });
            } else {
                reject();
            }
        });

        promise.then((response) => {

            setAuthorizationToken(response.Token);
            
            modalModel.display.fail = "none";
            modalModel.display.success = "";
            modalModel.message = "Account activation completed and you were automatically logged in.";
            modalModel.title = "Activation Successful";

            this.dialogService.open({
                viewModel: 'modals/activationCompleteModal',
                model: modalModel
            });

        }).catch(() => {

            modalModel.display.fail = "";
            modalModel.display.success = "none";
            modalModel.message = "We were unable to activate your account, please make sure you have registered first.";
            modalModel.title = "Activation Failed";

            this.dialogService.open({
                viewModel: 'modals/activationCompleteModal',
                model: modalModel
            }).then(response => {
                window.location.href = routes.home;
            }).catch(error => {
                window.location.href = routes.home;
            });
        });
    }

    activate(params) {
        this.params = params;
    }
}
