import { bindable, useView, customElement } from 'aurelia-framework';
import { PLATFORM } from 'aurelia-pal';


@customElement('loading-screen')
@useView(PLATFORM.moduleName('./loading-screen.html'))
export class LoadingScreen {
  @bindable loading = true;

  loadingChanged(newValue) {
    if (newValue) {
      
    } else {
      
    }
  }
}
