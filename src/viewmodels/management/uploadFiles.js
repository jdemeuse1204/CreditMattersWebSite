import { useView } from 'aurelia-framework';
import { inject } from 'aurelia-dependency-injection';
import * as loadingScreen from '../../common/loadingScreen';
import { PLATFORM } from 'aurelia-pal';

@useView(PLATFORM.moduleName('../../views/management/uploadFiles.html'))
export class UploadFiles {

  files = [];

  constructor() {

  }

  attached() {


  }
}
