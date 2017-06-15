/* beautify preserve:start */
import {customElement, useView, bindable, bindingMode} from 'aurelia-framework';
/* beautify preserve:end */

@customElement('file-picker')
@useView('./file-picker.html')
export class FilePicker {

  @bindable accept = '';
  @bindable multiple = false;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) files;

  input = HTMLInputElement;

  filesChanged() {
    if (!this.files) {
      this.clearSelection();
    }
  }

  clearSelection() {
    this.input.type = '';
    this.input.type = 'file';
  }
}
