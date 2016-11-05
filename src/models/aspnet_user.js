// Module require
import * as _ from "lodash";
import userAddress from "./userAddress";
import aspnet_userInformation from "./aspnet_userInformation";
import aspnet_membership from "./aspnet_membership";


let _addressString = "{0}, {1}, {2} {3}",
    _combineAddressLines = function(address) {

        if (_.isEmpty(address.Address2)) {
            return address.Address1;
        }

        return kendo.format("{0} {1}", address.Address1, address.Address2);
    },
    _getFullZip = function(address) {

        if (_.isEmpty(address.Zip4)) {
            return address.Zip5;
        }

        return kendo.format("{0}-{1}", address.Zip5, address.Zip4);
    },
    _getAddressHtmlDisplay = function(address) {
        if (_.isEmpty(address)) {
            return "";
        }

        return kendo.format(_addressString,
            _combineAddressLines(address),
            address.City,
            address.State.Code,
            _getFullZip(address));
    },
    _getAddress = function(user, addressType) {
        const result = _.find(user.UserAddresses, function(w) { return w.Address && w.Address.Type === addressType && w.Address.Id !== 0; });

        return !result ? null : result.Address;
    },
    _user = kendo.data.Model.define({

        //Mailing = 0,
        //Home,
        //Work,
        //Previous,
        //Other
        hasAddress: function() {
            const index = _.findIndex(this.UserAddresses, function(i) { return i.AddressId !== 0; });

            return index !== -1;
        },

        getMailingAddress: function() {
            return _getAddress(this, 0);
        },
        getMailingAddressDisplayStyle: function() {
            return this.getMailingAddress() ? "" : "none";
        },
        getMailingAddressHtmlDisplay: function() {
            const address = this.getMailingAddress();

            return _getAddressHtmlDisplay(address);
        },

        getHomeAddress: function() {
            return _getAddress(this, 1);
        },
        getHomeAddressDisplayStyle: function() {
            return this.getHomeAddress() ? "" : "none";
        },
        getHomeAddressHtmlDisplay: function() {

            const address = this.getHomeAddress();

            return _getAddressHtmlDisplay(address);
        },

        getOtherAddress: function() {
            return _getAddress(this, 4);
        },
        getOtherAddressDisplayStyle: function() {
            return this.getOtherAddress() ? "" : "none";
        },
        getOtherAddressHtmlDisplay: function() {

            const address = this.getOtherAddress();

            return _getAddressHtmlDisplay(address);
        },

        getPreviousAddress: function() {
            return _getAddress(this, 3);
        },

        getName: function() {

            if (_.isEmpty(this.aspnet_UserInformation)) {
                return "";
            }

            if (!_.isEmpty(this.aspnet_UserInformation.MiddleInitial)) {
                return kendo.format("{0} {1} {2}",
                    this.aspnet_UserInformation.FirstName,
                    this.aspnet_UserInformation.MiddleInitial,
                    this.aspnet_UserInformation.LastName);
            }

            return kendo.format("{0} {1}",
                this.aspnet_UserInformation.FirstName,
                this.aspnet_UserInformation.LastName);
        },

        id: "UserId",
        fields: {
            "UserId": { editable: true, type: "string" },
            "ApplicationId": { editable: true, type: "string" },
            "UserName": { editable: true, type: "string" },
            "LoweredUserName": { editable: true, type: "number" },
            "MobileAlias": { editable: true, type: "string" },
            "IsAnonymous": { editable: true, type: "boolean" },
            "LastActivityDate": { editable: false, type: "date" },
            "JwtSecretPassPhrase": { editable: true, type: "string" },
            "HasTemporaryPassword": { editable: true, type: "boolean" },
            "InvalidResetAttempts": { editable: true, type: "number" },

            "UserAddresses": [
                {
                    editable: true,
                    defaultValue: new userAddress(),
                    parse: function(data) { return new userAddress(data); }
                }
            ],
            "aspnet_UserInformation": {
                editable: true,
                defaultValue: new aspnet_userInformation(),
                parse: function(data) { return new aspnet_userInformation(data); }
            },
            "aspnet_Membership": {
                editable: true,
                defaultValue: new aspnet_membership(),
                parse: function(data) { return new aspnet_membership(data); }
            }
        }
    });

export default _user;