import { account } from "./repository";
import { isNullOrEmpty, formatAddress } from "./utils";
import { find } from "lodash";

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
                        items.push({ isPlaceHolder: false, type: "MobilePhoneNumber", content: response.aspnet_UserInformation.MobileNumber });
                    }

                    if (hasHomeNumber === true) {
                        items.push({ isPlaceHolder: false, type: "HomePhoneNumber", content: response.aspnet_UserInformation.HomeNumber });
                    }

                    if (hasWorkNumber === true) {
                        items.push({ isPlaceHolder: false, type: "WorkPhoneNumber", content: response.aspnet_UserInformation.WorkNumber });
                    }

                } else {
                    items.push({ isPlaceHolder: true, type: "HomePhoneNumber", content: "Click to add phone number" });
                }

                // email address
                items.push({ isPlaceHolder: false, type: "EmailAddress", content: response.aspnet_Membership.Email });

                // addresses    Mailing = 0, Home, Work, Previous, Other
                if (response.UserAddresses == null || response.UserAddresses.length === 0) {
                    items.push({ isPlaceHolder: true, type: "HomeAddress", content: "Click to add address" });
                } else {

                    const mailingAddress = find(response.UserAddresses, (i) => { return i.Address.Type === 0; }),
                        homeAddress = find(response.UserAddresses, (i) => { return i.Address.Type === 1; });

                    if (!!mailingAddress) {
                        items.push({ isPlaceHolder: false, type: "MailingAddress", content: formatAddress(mailingAddress.Address) });
                    }

                    if (!!homeAddress) {
                        items.push({ isPlaceHolder: false, type: "HomeAddress", content: formatAddress(homeAddress.Address) });
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