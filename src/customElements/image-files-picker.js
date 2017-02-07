import { customElement, useView, bindable, bindingMode } from 'aurelia-framework';
import { AcceptValidator } from '../common/acceptFileValidator';

@customElement('image-files-picker')
@useView('./image-files-picker.html')
export class ImageFilesPicker {

    @bindable({ defaultBindingMode: bindingMode.twoWay }) files = [];
    @bindable accept = 'image/*';
    acceptValidator = AcceptValidator.parse(this.accept);

    selectedFiles;

    acceptChanged() {
        this.acceptValidator = AcceptValidator.parse(this.accept);
    }

    add(files) {
        for (let i = 0; i < files.length; ++i) {
            const file = files.item(i);
            const isValid = this.acceptValidator.isValid(file);
            if (isValid) {
                this.files.push(file);
            }
        }
    }

    remove(index) {
        this.files.splice(index, 1);
    }

    addSelectedFiles() {
        this.add(this.selectedFiles);
        this.selectedFiles = null;
    }
}