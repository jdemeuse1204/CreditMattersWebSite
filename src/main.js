// we want font-awesome to load as soon as possible to show the fa-spinner
import 'bootstrap';
import 'whatwg-fetch';

// comment out if you don't want a Promise polyfill (remove also from webpack.common.js)
import * as Bluebird from 'bluebird';
Bluebird.config({ warnings: false });

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
    .plugin("aurelia-validatejs")
    .plugin('aurelia-kendoui-bridge')
    .feature('resources');

  await aurelia.start();
  aurelia.setRoot('viewmodels/app');
}