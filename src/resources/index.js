import {FrameworkConfiguration} from 'aurelia-framework';

export function configure(config) {
  config.globalResources([
    '../attributes/blob-src',
    '../attributes/file-drop-target',
    '../customElements/file-picker',
    '../customElements/image-files-picker',
    '../valueConverters/chunk'
  ]);
}
