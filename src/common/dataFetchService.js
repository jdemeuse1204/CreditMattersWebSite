import { account } from "./repository";
import { isNullOrEmpty, formatAddress } from "./utils";
import { find } from "lodash";
import * as constants from '../constants';

export function getUserInformation() {

    return new Promise((resolve, reject) => {

        account.getUserInformation().then(function (response) {

            try {

                let items = [];

                const hasMobileNumber = isNullOrEmpty(response.aspnet_UserInformation.MobileNumber) === false,
                    hasHomeNumber = isNullOrEmpty(response.aspnet_UserInformation.HomeNumber) === false,
                    hasWorkNumber = isNullOrEmpty(response.aspnet_UserInformation.WorkNumber) === false,
                    hasAnyNumber = hasMobileNumber || hasHomeNumber || hasWorkNumber;

                // phone numbers
                if (hasAnyNumber === true) {

                    if (hasMobileNumber === true) {
                        items.push({ isPlaceHolder: false, type: constants.phoneNumberTypes.mobile, content: response.aspnet_UserInformation.MobileNumber, isPrimary: response.aspnet_UserInformation.IsMobilePrimary });
                    }

                    if (hasHomeNumber === true) {
                        items.push({ isPlaceHolder: false, type: constants.phoneNumberTypes.home, content: response.aspnet_UserInformation.HomeNumber, isPrimary: response.aspnet_UserInformation.IsHomePrimary });
                    }

                    if (hasWorkNumber === true) {
                        items.push({ isPlaceHolder: false, type: constants.phoneNumberTypes.work, content: response.aspnet_UserInformation.WorkNumber, isPrimary: response.aspnet_UserInformation.IsWorkPrimary });
                    }

                } else {
                    items.push({ isPlaceHolder: true, type: constants.phoneNumberTypes.home, content: "Click to add phone number", isPrimary: false });
                }

                // email address
                items.push({ isPlaceHolder: false, type: "EmailAddress", content: response.aspnet_Membership.Email, isPrimary: false });

                // addresses    Mailing = 0, Home, Work, Previous, Other
                if (response.UserAddresses == null || response.UserAddresses.length === 0) {
                    items.push({ isPlaceHolder: true, type: "HomeAddress", content: "Click to add address", isPrimary: false });
                } else {

                    const mailingAddress = find(response.UserAddresses, (i) => { return i.Address.Type === 0; }),
                        homeAddress = find(response.UserAddresses, (i) => { return i.Address.Type === 1; });

                    if (!!mailingAddress) {
                        items.push({ isPlaceHolder: false, type: "MailingAddress", content: formatAddress(mailingAddress.Address), isPrimary: false });
                    }

                    if (!!homeAddress) {
                        items.push({ isPlaceHolder: false, type: "HomeAddress", content: formatAddress(homeAddress.Address), isPrimary: false });
                    }
                }

                const fullName = `${response.aspnet_UserInformation.FirstName} ${response.aspnet_UserInformation.LastName}`;

                resolve({
                    demographics : items,
                    fullName: fullName
                });

            } catch (e) {
                reject();
            }

        }).catch(() => {
            reject();
        });
    });

}