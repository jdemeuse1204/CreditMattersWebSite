import { account } from '../../common/repository';
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
        debugger;
    }

    drawerNavigate() {
        debugger;
    }
}