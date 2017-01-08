// Module require
import q from "q";
import aspnet_user from "../models/aspnet_user";
import creditBureauEntry from "../models/creditBureauEntry";
import states from "../models/state";
import creditBureau from "../models/creditBureau";
import creditBureauStatus from "../models/creditBureauStatus";
import * as constants from "../constants";
import { post, get } from "./webApi";
import loginFunctions from "./loginFunctions";
import { createKendoDataSource } from "../common/webApi";

const LOOKUP_CONTROLLER = "Lookup";
const ACCOUNT_CONTROLLER = "Account";
const MANAGEMENT_CONTROLLER = "Management";
const REGISTER_CONTROLLER = "Register";
const _getUrl = (controllerName, endPoint) => {
    return `api/${controllerName}/${endPoint}`;
};

export const lookup = {

    getStates: function () {
        return get(_getUrl(LOOKUP_CONTROLLER, "GetStates"));
    },
    getCreditors: function () {
        return get(_getUrl(LOOKUP_CONTROLLER, "GetCreditors"));
    },
    getAdverseTypes: function () {
        return get(_getUrl(LOOKUP_CONTROLLER, "GetAdverseTypes"));
    },
    getDisputeReasons: function (adverseType) {
        return get(_getUrl(LOOKUP_CONTROLLER, `GetDisputeReasons/${adverseType}`));
    },
    getCreditBureaus: function () {

        const d = q.defer(),
            model = kendo.data.DataSource.create({
                transport: {
                    read: {
                        url: _getUrl(LOOKUP_CONTROLLER, "GetCreditBureaus"),
                        type: "GET"
                    }
                },
                schema: {
                    data: "Data.result",
                    model: creditBureau
                }
            });
        model.read()
            .then(function () {

                d.resolve(model.data());

            });

        return d.promise;
    },
    getCreditBureauStatuses: function () {

        return new Promise((resolve, reject) => {

            const url = _getUrl(LOOKUP_CONTROLLER, "GetCreditBureauStatuses");
            const model = createKendoDataSource({
                transport: {
                    read: {
                        type: "GET"
                    }
                },
                schema: {
                    data: "Data.result",
                    model: creditBureauStatus
                }
            }, url);

            model.read().then(() => {
                resolve(model.data()[0]);
            }).fail(() => {
                reject();
            });
        });
    }
};

export const account = {

    canAccessManagementPages: function () {
        return post(_getUrl(ACCOUNT_CONTROLLER, "CanAccessManagementPages"));
    },
    sendAuthorizationCode: function (username) {
        return post(_getUrl(ACCOUNT_CONTROLLER, "SendDeviceAuthorizationCode"), { username: username });
    },
    login: function (username, password) {
        return post(_getUrl(ACCOUNT_CONTROLLER, "Login"), { username: username, password: password });
    },
    trySendResetPasswordEmail: function (username, securityAnswerOne, securityAnswerTwo) {
        return post(_getUrl(ACCOUNT_CONTROLLER, "TrySendResetPasswordEmail"),
            { Username: username, SecurityAnswerOne: securityAnswerOne, SecurityAnswerTwo: securityAnswerTwo });
    },
    getSecurityQuestions: function (username) {
        return post(_getUrl(ACCOUNT_CONTROLLER, "GetSecurityQuestions"), { Username: username });
    },
    resetPassword: function (username, uid, password, oldPassword) {
        return post(_getUrl(ACCOUNT_CONTROLLER, "ResetPassword"),
            { Username: username, Uid: uid, NewPassword: password, OldPassword: oldPassword });
    },
    isUidValid: function (uid) {
        return post(_getUrl(ACCOUNT_CONTROLLER, "IsUidValid"), { Uid: uid });
    },
    verifyVerificationCode: function (username, password, code) {
        return post(_getUrl(ACCOUNT_CONTROLLER, "VerifyVerificationCode"), { Username: username, Password: password, PIN: code });
    },
    getUserMembership: function () {
        return post(_getUrl(ACCOUNT_CONTROLLER, "GetUserMembership"));
    },
    saveEmailAddresses: function (alternateEmailAddress) {
        return post(_getUrl(ACCOUNT_CONTROLLER, "SaveEmailAddresses"), { AlternateEmailAddress: alternateEmailAddress });
    },
    saveUserPhoneNumbers: function (numbers) {
        return post(_getUrl(ACCOUNT_CONTROLLER, "SaveUserPhoneNumbers"),
            {
                MobileNumber: numbers.MobileNumber,
                HomeNumber: numbers.HomeNumber,
                WorkNumber: numbers.WorkNumber,
                IsMobilePrimary: numbers.IsMobilePrimary,
                IsHomePrimary: numbers.IsHomePrimary,
                IsWorkPrimary: numbers.IsWorkPrimary
            });
    },
    isAdmin: function () {
        return get(_getUrl(ACCOUNT_CONTROLLER, "IsAdmin"));
    },
    getUserInformation: function () {

        return new Promise((resolve, reject) => {

            const url = _getUrl(ACCOUNT_CONTROLLER, "GetUserContactInformation");
            const model = createKendoDataSource({
                transport: {
                    read: {
                        type: "POST"
                    }
                },
                schema: {
                    data: "Data.result",
                    model: aspnet_user
                }
            }, url);

            model.read().then(() => {
                resolve(model.data()[0]);
            }).fail(() => {
                reject();
            });

        });
    },
    isUserAuthorized: function () {
        return post(_getUrl(ACCOUNT_CONTROLLER, "IsUserAuthorized"));
    }
};

export const register = {

    submitRegistration: function (firstName,
        lastName,
        emailAddress,
        password) {
        return post(_getUrl(REGISTER_CONTROLLER, "SubmitRegistration"),
            {
                FirstName: firstName,
                LastName: lastName,
                Email: emailAddress,
                Password: password
            });
    },
    getSecurityQuestions: function () {
        return get(_getUrl(REGISTER_CONTROLLER, "GetSecurityQuestions"));
    },
    authorizeUser: function (uid) {
        return post(_getUrl(REGISTER_CONTROLLER, "AuthorizeUser"), { authorizationId: uid });
    }
};

export const management = {

    saveCreditItem: function (creditItem) {

        return post(_getUrl(MANAGEMENT_CONTROLLER, "SaveCreditItem"), creditItem);
    },
    sendToCds: function (creditItemId, creditBureauIds) {
        
        return post(_getUrl(MANAGEMENT_CONTROLLER, "SendToCds"), { 
            creditBureaus: creditBureauIds,
            creditItemId: creditItemId
        });
    },
    getCreditItems: function (creditBureau) {
        return get(_getUrl(MANAGEMENT_CONTROLLER, "GetCreditItems"), { bureau: constants.getCreditBureauId(creditBureau) });
    },
    getCreditItemsThatNeedDisputeReasonAcceptance: function(creditBureau) {
        return get(_getUrl(MANAGEMENT_CONTROLLER, "GetCreditItemsThatNeedDisputeReasonAcceptance"), { bureau: constants.getCreditBureauId(creditBureau) });
    },
    getCustomerDisputeStatements: function() {
        return get(_getUrl(MANAGEMENT_CONTROLLER, "GetCustomerDisputeStatements"), { bureau: constants.getCreditBureauId(creditBureau) });
    },
    getCreditItem: function (id) {

        return new Promise((resolve, reject) => {

            const url = _getUrl(MANAGEMENT_CONTROLLER, "GetCreditItem");
            const model = createKendoDataSource({
                transport: {
                    read: {
                        type: "GET"
                    },
                    parameterMap: function () {
                        const values = {};
                        values.id = id;
                        return values;
                    }
                },
                schema: {
                    data: "Data.result",
                    model: creditBureauEntry
                }
            }, url);

            model.read().then(() => {
                resolve(model.data()[0]);
            }).fail(() => {
                reject();
            });
        });
    },
    changeCreditItemResponse: function (creditBureau, status, creditItemId) {
        switch (creditBureau) {
            case constants.creditBureaus.transUnion:
                return post(_getUrl(MANAGEMENT_CONTROLLER, "ChangeCreditItemResponse"), {
                    creditBureau: 1,
                    creditItemId: creditItemId,
                    response: constants.getCreditBureauResponseId(status)
                });
            case constants.creditBureaus.equifax:
                return post(_getUrl(MANAGEMENT_CONTROLLER, "ChangeCreditItemResponse"), {
                    creditBureau: 2,
                    creditItemId: creditItemId,
                    response: constants.getCreditBureauResponseId(status)
                });
            case constants.creditBureaus.experian:
                return post(_getUrl(MANAGEMENT_CONTROLLER, "ChangeCreditItemResponse"), {
                    creditBureau: 3,
                    creditItemId: creditItemId,
                    response: constants.getCreditBureauResponseId(status)
                });
            default:
                break;
        }
    }
};