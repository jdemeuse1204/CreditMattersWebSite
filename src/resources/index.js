import { PLATFORM } from 'aurelia-pal';

export function configure(config) {
  config.globalResources([
    // '../attributes/blob-src',
    // '../attributes/file-drop-target',
    // '../customElements/file-picker',
    // '../customElements/image-files-picker',
    // '../valueConverters/chunk',
    PLATFORM.moduleName('../customElements/loading-screen')
  ]);
}
