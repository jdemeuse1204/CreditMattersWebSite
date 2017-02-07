import { useView } from 'aurelia-framework';
import { inject } from 'aurelia-dependency-injection';
import * as loadingScreen from "../../common/loadingScreen";

@useView('../../views/management/uploadFiles.html')
export class UploadFiles {

    files = [];

    constructor() {

    }

    attached() {


    }
}
