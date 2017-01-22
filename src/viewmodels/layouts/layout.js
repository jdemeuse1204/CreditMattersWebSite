import { account } from '../../common/repository';
import { logout, getClaims, getAuthorizationToken } from '../../common/authorization';
import drawer from '../../common/drawer';
import { useView } from 'aurelia-framework';
import { routes } from '../../constants';
import ls from '../../common/localStorage';

@useView('../views/layouts/layout.html')
export class Layout {

    firstName = "";
    accountType = "Free Trial";
    profileStatus = "";

    constructor() {

    }

    activate() {

        const token = getAuthorizationToken();

        if (!!token) {

            const claims = getClaims(token);
            this.firstName = claims.usr;
            
            // get profile status
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