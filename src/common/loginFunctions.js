// Module require
import _ from "lodash";
import moment from "moment";
import ls from "./localStorage";

// Token
// Remembered Devices (By username (array))
// Remembered Remember Me (string)
// can only have one per pc
// store remebered devices separately

// token ids
// cm_info
// cm_devices
let _tokenInfoKey = "cm_info", // one per browser because it contains our session and remember me info
    _tokenDevicesKey = "cm_devices",
    _tokenRememberedUsername = "cm_auth_user",
    _infoModel = function() {
        return {
            username: "",
            token: "",
            firstName: "",
            addressCompletedDate: ""
        }
    },
    _deviceModel = function() {
        return {
            username: "",
            expirationDate: ""
        };
    };

export default function(tokenExpirationDays) {

    let _get = function(key) {

        const data = ls.get(key);

        if (!!data) {
            return data;
        }

        return key === _tokenInfoKey ? new _infoModel() : [];
    },
        _set = function(data, tokenName) {

            ls.set(data, tokenName);

        },


        _deviceNeedsAuthorization = function(username) {

            const array = ls.get(_tokenDevicesKey);

            if (_.isEmpty(array)) {
                return true;
            }

            const index = _.findIndex(array, function(item) {
                if (item.username === username) {
                    return moment(item.expirationDate).diff(moment(), "days") > 0;
                }
            });

            return index === -1;
        },
        _setRememberedUsername = function (username) {

            _set(username, _tokenRememberedUsername);
        },
        _getRememberedUsername = function() {

            const username = ls.get(_tokenRememberedUsername);

            if (_.isEmpty(username)) {
                return "";
            }

            return username;
        },
        _setToken = function(token, firstName, addressCompletedDate) {

            const item = _get(_tokenInfoKey);

            item.token = token;
            item.firstName = firstName;
            item.addressCompletedDate = addressCompletedDate;

            _set(item, _tokenInfoKey);
        },
        _getToken = function() {
            return _get(_tokenInfoKey);
        },
        _removeToken = function() {

            const token = _get(_tokenInfoKey);

            token.token = "";

            _set(token, _tokenInfoKey);
        },
        _forgetRememberedUser = function() {
            ls.remove(_tokenRememberedUsername);
        },
        _rememberDevice = function(username) {

            let data = _get(_tokenDevicesKey) || [],
                index = _.findIndex(data, function(item) {
                    return item.username === username;
                });

            // user not found
            if (index === -1) {
                const model = new _deviceModel();

                model.username = username;
                model.expirationDate = moment().add(tokenExpirationDays, "days").format();

                if (!data.push) {
                    data = [];
                }
                data.push(model);

                _set(data, _tokenDevicesKey);
                return;
            }
        };

    return {
        rememberDevice: _rememberDevice,

        getToken: _getToken,
        setToken: _setToken,
        removeToken: _removeToken,

        getRememberedUsername: _getRememberedUsername,
        setRememberedUsername: _setRememberedUsername,
        forgetRememberedUser: _forgetRememberedUser,
        deviceNeedsAuthorization: _deviceNeedsAuthorization
    };
};