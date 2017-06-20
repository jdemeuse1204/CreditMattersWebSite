/* beautify preserve:start */
import { bindable, useView, customElement } from 'aurelia-framework';
import { PLATFORM } from 'aurelia-pal';
import './loading-screen.less';
import * as nprogress from 'nprogress';
import 'nprogress/nprogress.css';
/* beautify preserve:end */

@customElement('loading-screen')
@useView(PLATFORM.moduleName('./loading-screen.html'))
export class LoadingScreen {
  @bindable loading = false;

  loadingChanged(newValue) {
    if (newValue) {
      nprogress.start();
    } else {
      nprogress.done();
    }
  }
}
