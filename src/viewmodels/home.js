import { useView } from 'aurelia-framework';
import {account} from '../common/repository';
import {isEmpty} from 'lodash';

@useView('../views/home.html')
export class Home {

    loginDisplay = "block";
    dashboardDisplay = "none";

    constructor() {
        // check to see if the user is authorized
        this.isUserAuthorized();
    }

    isUserAuthorized() {

        account.isUserAuthorized().done((response) => {

            if (isEmpty(response.Data.result.Token)) {
                this.loginDisplay = "block";
                this.dashboardDisplay = "none";
                return;
            }

            this.loginDisplay = "none";
            this.dashboardDisplay = "block";
        });
    }
}