import "bootstrap";
import { useView } from 'aurelia-framework';
import { inject } from 'aurelia-dependency-injection';
import { DialogService } from 'aurelia-dialog';
import { account } from "../../common/repository";
import * as loadingScreen from "../../common/loadingScreen";
import { getUserInformation } from "../../common/dataFetchService";

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
      case "HomePhoneNumber":
        this.openPhoneNumbersModal();
        break;
    };
  }

  openPhoneNumbersModal() {

    const modalModel = {
      creditItemId: "",
      homePhoneNumber: "",
      workPhoneNumber: "",
      mobilePhoneNumber: ""
    };

    this.dialogService.open({
      viewModel: 'modals/phoneNumbersModal',
      model: modalModel
    }).then(response => {

    }).catch(error => {

    });
  }
}
