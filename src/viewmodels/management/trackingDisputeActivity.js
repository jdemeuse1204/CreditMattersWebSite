import { useView } from 'aurelia-framework';
import { inject } from 'aurelia-dependency-injection';
import * as loadingScreen from '../../common/loadingScreen';
import { PLATFORM } from 'aurelia-pal';
import '../../styles/index.less';
import '../../styles/management/trackingDisputeActivity.less';

@useView(PLATFORM.moduleName('../../views/management/trackingDisputeActivity.html'))
export class TrackingDisputeActivity {

  constructor() {

  }

  attached() {


  }
}
