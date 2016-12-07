import "bootstrap";

import { useView } from 'aurelia-framework';
import { account } from "../../common/repository";
import * as loadingScreen from "../../common/loadingScreen";
import { getUserInformation } from "../../common/dataFetchService";

@useView('../../views/management/myProfile.html')
export class MyProfile {

userInformationItems = [];
fullName = "";

  async activate() {

	let response = await getUserInformation();

	this.userInformationItems = response.demographics;
    this.fullName = response.fullName;
  }

}
