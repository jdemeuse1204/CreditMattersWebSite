/* beautify preserve:start */
import { customAttribute, bindingMode, inject } from 'aurelia-framework';
/* beautify preserve:end */

@customAttribute('file-drop-target', bindingMode.twoWay)
@inject(Element)
export class FileDropTarget {

  value;
  element;

  constructor(element) {
    this.element = element;
  }

  attached() {
    this.element.addEventListener('dragover', this.onDragOver);
    this.element.addEventListener('drop', this.onDrop);
    this.element.addEventListener('dragend', this.onDragEnd);
  }

  onDragOver = (e) => {
    e.stopPropagation();
    e.preventDefault();

    e.dataTransfer.dropEffect = 'copy';
  };

  onDrop = (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (typeof this.value === 'function') {
      this.value({
        files: e.dataTransfer.files
      });
    } else {
      this.value = e.dataTransfer.files;
    }
  };

  onDragEnd = (e) => {
    e.stopPropagation();
    e.preventDefault();

    e.dataTransfer.clearData();
  };

  detached() {
    this.element.removeEventListener('dragend', this.onDragEnd);
    this.element.removeEventListener('drop', this.onDrop);
    this.element.removeEventListener('dragover', this.onDragOver);
  }
}
