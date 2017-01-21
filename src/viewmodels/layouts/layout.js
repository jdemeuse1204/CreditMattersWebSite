import { account } from '../../common/repository';
import {logout, getClaims,getAuthorizationToken} from '../../common/authorization';
import drawer from '../../common/drawer';
import {useView} from 'aurelia-framework';
import { routes } from '../../constants';


@useView('../views/layouts/layout.html')
export class Layout {

    firstName = "";
    accountType = "Free Trial";

    constructor() {
        
    }

    activate() {
        const result = getAuthorizationToken();

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
        window.location.href = routes.home;
    }

    drawerNavigate() {
       
    }
}