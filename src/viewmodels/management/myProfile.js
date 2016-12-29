import "bootstrap";
import { useView } from 'aurelia-framework';
import { inject } from 'aurelia-dependency-injection';
import { DialogService } from 'aurelia-dialog';
import { account } from "../../common/repository";
import * as loadingScreen from "../../common/loadingScreen";
import { getUserInformation } from "../../common/dataFetchService";
import * as constants from '../../constants';
import { find } from 'lodash';

@useView('../../views/management/myProfile.html')
@inject(DialogService)
export class MyProfile {

  userInformationItems = [];
  fullName = "";
  dialogService = null;

  constructor(dialogService) {
    this.dialogService = dialogService;
  }

  async activate() {

    let response = await getUserInformation();

    this.userInformationItems = response.demographics;
    this.fullName = response.fullName;
  }

  editUserInfo(event, type, isPlaceHolder) {
    switch (type) {
      case constants.phoneNumberTypes.home:
      case constants.phoneNumberTypes.work:
      case constants.phoneNumberTypes.mobile:
        this.openPhoneNumbersModal();
        break;
    };
  }

  openPhoneNumbersModal() {

    const that = this;
    const homePhoneNumber = find(this.userInformationItems, { type: constants.phoneNumberTypes.home });
    const workPhoneNumber = find(this.userInformationItems, { type: constants.phoneNumberTypes.work });
    const mobilePhoneNumber = find(this.userInformationItems, { type: constants.phoneNumberTypes.mobile });
    const hasHomeNumber = homePhoneNumber && homePhoneNumber.isPlaceHolder === false;
    const hasWorkNumber = workPhoneNumber && workPhoneNumber.isPlaceHolder === false;
    const hasMobileNumber = mobilePhoneNumber && mobilePhoneNumber.isPlaceHolder === false;
    let primaryNumberId = constants.phoneNumberTypeIds.home;

    if (hasWorkNumber === true && workPhoneNumber.isPrimary === true) {
      primaryNumberId = constants.phoneNumberTypeIds.work;
    } else if (hasMobileNumber === true && mobilePhoneNumber.isPrimary === true) {
      primaryNumberId = constants.phoneNumberTypeIds.mobile;
    }

    const modalModel = {
      homePhoneNumber: hasHomeNumber ? homePhoneNumber.content : "",
      workPhoneNumber: hasWorkNumber ? workPhoneNumber.content : "",
      mobilePhoneNumber: hasMobileNumber ? mobilePhoneNumber.content : "",
      primaryNumberId: primaryNumberId
    };

    this.dialogService.open({
      viewModel: 'modals/phoneNumbersModal',
      model: modalModel
    }).then(response => {

      if (response.wasCancelled === false) {

        let response = getUserInformation().then(response => {
          that.userInformationItems = response.demographics;
        });
      }

    }).catch(error => {

    });
  }
}
