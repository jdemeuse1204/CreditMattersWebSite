import { useView } from 'aurelia-framework';
import { PLATFORM } from 'aurelia-pal';

@useView(PLATFORM.moduleName('../views/error.html'))
export class Error {


    constructor() {

    }
}
