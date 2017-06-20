// we want font-awesome to load as soon as possible to show the fa-spinner
/* beautify preserve:start */
import 'font-awesome/css/font-awesome.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'babel-polyfill';
import 'whatwg-fetch';
import 'kendo-ui-core';
import * as Bluebird from 'bluebird';
import { PLATFORM } from 'aurelia-pal';
/* beautify preserve:end */
// remove out if you don't want a Promise polyfill (remove also from webpack.config.js)
Bluebird.config({
  warnings: {
    wForgottenReturn: false
  }
});

export async function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .developmentLogging()
    .plugin('aurelia-dialog', config => {
      config.useDefaults();
      config.settings.lock = true;
      config.settings.centerHorizontalOnly = false;
      config.settings.startingZIndex = 9999;
    })
    .plugin('aurelia-validation')
    //.plugin('aurelia-kendoui-bridge')
    .feature(PLATFORM.moduleName('resources/index'));

  await aurelia.start();
  await aurelia.setRoot(PLATFORM.moduleName('viewmodels/app'));
}
