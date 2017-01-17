import { account } from '../../common/repository';
import {logout} from '../../common/authorization';
import drawer from '../../common/drawer';
import {useView} from 'aurelia-framework';


@useView('../views/layouts/layout.html')
export class Layout {
    constructor() {
        
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