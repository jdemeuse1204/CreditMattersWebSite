/**
 * To learn more about how to use Easy Webpack
 * Take a look at the README here: https://github.com/easy-webpack/core
 **/
const core = require('@easy-webpack/core');
const path = require('path');
const webpack = require('webpack');

const envProd = require('@easy-webpack/config-env-production');
const envDev = require('@easy-webpack/config-env-development');
const aurelia = require('@easy-webpack/config-aurelia');
const babel = require('@easy-webpack/config-babel');
const html = require('@easy-webpack/config-html');
const fontAndImages = require('@easy-webpack/config-fonts-and-images');
const globalBluebird = require('@easy-webpack/config-global-bluebird');
const globalJquery = require('@easy-webpack/config-global-jquery');
const globalRegenerator = require('@easy-webpack/config-global-regenerator');
const generateIndexHtml = require('@easy-webpack/config-generate-index-html');
const commonChunksOptimize = require('@easy-webpack/config-common-chunks-simple');
const copyFiles = require('@easy-webpack/config-copy-files');
const uglify = require('@easy-webpack/config-uglify');
const generateCoverage = require('@easy-webpack/config-test-coverage-istanbul');

process.env.BABEL_ENV = 'webpack'
const ENV = process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase() || (process.env.NODE_ENV = 'development')

// basic configuration:
const title = 'Credit Matters'
const baseUrl = '/'
const rootDir = path.resolve()
const srcDir = path.resolve('src')
const outDir = path.resolve('dist')

const coreBundles = {
  bootstrap: [
    'aurelia-bootstrapper-webpack',
    'aurelia-polyfills',
    'aurelia-pal',
    'aurelia-pal-browser',
    'regenerator-runtime',
    'bluebird',
    'whatwg-fetch'
  ],
  // these will be included in the 'aurelia' bundle (except for the above bootstrap packages)
  aurelia: [
    'aurelia-bootstrapper-webpack',
    'aurelia-binding',
    'aurelia-dependency-injection',
    'aurelia-event-aggregator',
    'aurelia-framework',
    'aurelia-dialog',
    'aurelia-history',
    'aurelia-history-browser',
    'aurelia-loader',
    'aurelia-loader-webpack',
    'aurelia-logging',
    'aurelia-logging-console',
    'aurelia-metadata',
    'aurelia-pal',
    'aurelia-pal-browser',
    'aurelia-path',
    'aurelia-polyfills',
    'aurelia-route-recognizer',
    'aurelia-router',
    'aurelia-task-queue',
    'aurelia-templating',
    'aurelia-templating-binding',
    'aurelia-templating-router',
    'aurelia-templating-resources',
    'aurelia-validation'
  ]
}



/**
 * Main Webpack Configuration
 */
let config = core.generateConfig(
  {
    entry: {
      'app': ['./src/main' /* this is filled by the aurelia-webpack-plugin */],
      'aurelia-bootstrap': coreBundles.bootstrap,
      'aurelia': coreBundles.aurelia.filter(pkg => coreBundles.bootstrap.indexOf(pkg) === -1)
    },
    output: {
      path: outDir
    },
    resolve: {
      alias: {
        jquery: path.resolve("node_modules/kendo-ui-core/node_modules/jquery/dist/jquery.min.js"),
        kendo: path.resolve("node_modules/kendo-ui-core/js")
      }
    },
    plugins: [
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "window.jQuery": "jquery"
      }),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    ]
  },

  /**
   * Don't be afraid, you can put bits of standard Webpack configuration here
   * (or at the end, after the last parameter, so it won't get overwritten by the presets)
   * Because that's all easy-webpack configs are - snippets of premade, maintained configuration parts!
   * 
   * For Webpack docs, see: https://webpack.js.org/configuration/
   */

  ENV === 'test' || ENV === 'development' ?
    envDev(ENV !== 'test' ? {} : { devtool: 'inline-source-map' }) :
    envProd({ /* devtool: '...' */ }),

  aurelia({ root: rootDir, src: srcDir, title: title, baseUrl: baseUrl }),

  babel(),
  html(),
  fontAndImages(),
  globalBluebird(),
  globalJquery(),
  globalRegenerator(),
  generateIndexHtml({ minify: ENV === 'production' }),

  ...(ENV === 'production' || ENV === 'development' ? [
    commonChunksOptimize({ appChunkName: 'app', firstChunk: 'aurelia-bootstrap' }),
    copyFiles({ patterns: [{ from: 'favicon.ico', to: 'favicon.ico' }] })
  ] : [
      /* ENV === 'test' */
      generateCoverage({ options: { 'force-sourcemap': true, esModules: true } })
    ]),

  ENV === 'production' ?
    uglify({ debug: false, mangle: { except: ['cb', '__webpack_require__'] } }) : {}
)

module.exports = core.stripMetadata(config)