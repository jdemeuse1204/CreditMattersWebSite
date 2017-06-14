/* beautify preserve:start */
import { inject } from 'aurelia-dependency-injection';
import {DialogController} from 'aurelia-dialog';
import * as loadingScreen from '../common/loadingScreen';
import { lookup, management } from '../common/repository';
import '../styles/modals/editCdsItemModal.less';
/* beautify preserve:end */

@inject(DialogController)
export class EditCdsItemModal {

  controller = null;
  model = null;
  responses = [];
  hasCreditorAddress = false;

  constructor(controller) {
    this.controller = controller;
  }

  async activate(model) {
    this.model = model;

    const disputesResponse = await lookup.getDisputeStatuses();
    const addressResponse = await management.getCustomerDipsuteStatementAddress(this.model.creditItem.CustomerDisputeStatementId);

    this.responses = disputesResponse.Data.result;
    this.hasCreditorAddress == !!addressResponse.Data.result;
  }

  attached() {
    loadingScreen.hide();
  }

  addAddress() {
    this.model.display.edit = 'none';
    this.model.display.address = '';
  }

  saveAddress() {

  }

  back() {
    this.model.display.edit = '';
    this.model.display.address = 'none';
  }
}
