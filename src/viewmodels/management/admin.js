/* beautify preserve:start */
import {useView} from 'aurelia-framework';
import { PLATFORM } from 'aurelia-pal';
import '../../styles/index.less';
import '../../styles/management/admin.less';
/* beautify preserve:end */

@useView(PLATFORM.moduleName('../../views/management/admin.html'))
export class Admin {

  constructor() {
      
  }
}
