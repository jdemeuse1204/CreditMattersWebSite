import { account } from '../../common/repository';
import {logout, getClaims} from '../../common/authorization';
import drawer from '../../common/drawer';
import {useView} from 'aurelia-framework';
import loginFunctions from "../../common/loginFunctions";


@useView('../views/layouts/layout.html')
export class Layout {

    firstName = "";
    accountType = "Free Trial";

    constructor() {
        
    }

    activate() {
        const result = loginFunctions(1000).getToken();

        if (!!result && !!result.token) {

            const claims = getClaims(result.token);

            this.firstName = claims.usr;
        }
    }

    attached() {
        drawer.initialize();
    }

    logout() {
        logout();
    }

    drawerNavigate() {
       
    }
}