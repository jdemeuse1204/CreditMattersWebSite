import { inject } from 'aurelia-dependency-injection';
import { DialogController } from 'aurelia-dialog';
import { account } from '../common/repository';
import * as loadingScreen from '../common/loadingScreen';
import { setDeviceAuthorizationToken } from '../common/authorization';

@inject(DialogController)
export class EditTwoFactorAuthModal {

    controller = null;
    model = null;
    deviceExpirationLimits = [{ limit: 30, default: false, name: "30 Days" },
    { limit: 60, default: false, name: "60 Days" },
    { limit: 90, default: false, name: "90 Days" },
    { limit: 365, default: false, name: "1 Year" },
    { limit: -1, default: true, name: "Never" }];

    constructor(controller) {
        this.controller = controller;
    }

    activate(model) {
        this.model = model
    }

    toggle() {

        this.model.twoFactorAuthTimeOut = -1;

        if (this.model.isTwoFactorAuthEnabled === true) {
            this.model.isTwoFactorAuthEnabled = false;
            return;
        }
        // enabling
        this.model.isTwoFactorAuthEnabled = true;
    }

    save() {

        loadingScreen.show();

        if (this.model.isTwoFactorAuthEnabled === true) {

            account.enableTwoFactorAuthentication(this.model.twoFactorAuthTimeOut).then(response => {

                if (response.Data.success === true) {
                    setDeviceAuthorizationToken(response.Data.result.DeviceAuthorizationToken);
                }

            }).catch(() => { }).finally(() => {
                loadingScreen.hide();
            });
            return;
        }

        account.disableTwoFactorAuthentication().then(response => {

            if (response.Data.success === true) {
                setDeviceAuthorizationToken(response.Data.result.DeviceAuthorizationToken);
            }

        }).catch(() => { }).finally(() => {
            loadingScreen.hide();
        });
    }
}