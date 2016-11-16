// Module require
import q from "q";
import aspnet_user from "../models/aspnet_user";
import creditBureauEntry from "../models/creditBureauEntry";
import states from "../models/state";
import creditBureau from "../models/creditBureau";
import creditBureauStatus from "../models/creditBureauStatus";
import * as constants from "../constants";
import * as environment from '../environment';

const LOOKUP_CONTROLLER = "Lookup";
const ACCOUNT_CONTROLLER = "Account";
const MANAGEMENT_CONTROLLER = "Management";
const REGISTER_CONTROLLER = "Register";

let _post = function (url, payload) {

    if (payload) {
        return $.post(`${environment.repositoryUrl}${url}`, payload);
    }

    return $.post(`${environment.repositoryUrl}${url}`);
},
    _get = function (url, payload) {

        if (payload) {
            return $.getJSON(`${environment.repositoryUrl}${url}`, payload);
        }

        return $.getJSON(`${environment.repositoryUrl}${url}`);
    },
    _getUrl = (controllerName, endPoint) => {
        return `api/${controllerName}/${endPoint}`;
    };

export const lookup = {

    getStates: function () {
        return _get(_getUrl(LOOKUP_CONTROLLER, "GetStates"));
    },
    getCreditors: function () {
        return _get(_getUrl(LOOKUP_CONTROLLER, "GetCreditors"));
    },
    getAdverseTypes: function () {
        return _get(_getUrl(LOOKUP_CONTROLLER, "GetAdverseTypes"));
    },
    getDisputeReasons: function (adverseType) {
        return _get(_getUrl(LOOKUP_CONTROLLER, `GetDisputeReasons/${adverseType}`));
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

        const d = q.defer(),
            model = kendo.data.DataSource.create({
                transport: {
                    read: {
                        url: _getUrl(LOOKUP_CONTROLLER, "GetCreditBureauStatuses"),
                        type: "GET"
                    }
                },
                schema: {
                    data: "Data.result",
                    model: creditBureauStatus
                }
            });

        model.read()
            .then(function () {

                d.resolve(model.data());

            });

        return d.promise;
    }
};

export const account = {

    sendAuthorizationCode: function (username) {
        return _post(_getUrl(ACCOUNT_CONTROLLER, "SendDeviceAuthorizationCode"), { username: username });
    },
    login: function (username, password) {
        return _post(_getUrl(ACCOUNT_CONTROLLER, "Login"), { username: username, password: password });
    },
    trySendResetPasswordEmail: function (username, securityAnswerOne, securityAnswerTwo) {
        return _post(_getUrl(ACCOUNT_CONTROLLER, "TrySendResetPasswordEmail"),
            { Username: username, SecurityAnswerOne: securityAnswerOne, SecurityAnswerTwo: securityAnswerTwo });
    },
    getSecurityQuestions: function (username) {
        return _post(_getUrl(ACCOUNT_CONTROLLER, "GetSecurityQuestions"), { Username: username });
    },
    resetPassword: function (username, uid, password, oldPassword) {
        return _post(_getUrl(ACCOUNT_CONTROLLER, "ResetPassword"),
            { Username: username, Uid: uid, NewPassword: password, OldPassword: oldPassword });
    },
    isUidValid: function (uid) {
        return _post(_getUrl(ACCOUNT_CONTROLLER, "IsUidValid"), { Uid: uid });
    },
    verifyVerificationCode: function (username, password, code) {
        return _post(_getUrl(ACCOUNT_CONTROLLER, "VerifyVerificationCode"), { Username: username, Password: password, PIN: code });
    },
    getUserMembership: function () {
        return _post(_getUrl(ACCOUNT_CONTROLLER, "GetUserMembership"));
    },
    saveEmailAddresses: function (alternateEmailAddress) {
        return _post(_getUrl(ACCOUNT_CONTROLLER, "SaveEmailAddresses"), { AlternateEmailAddress: alternateEmailAddress });
    },
    saveUserPhoneNumbers: function (mobileNumber,
        homeNumber,
        workNumber,
        isMobilePrimary,
        isHomePrimary,
        isWorkPrimary) {
        return _post(_getUrl(ACCOUNT_CONTROLLER, "SaveUserPhoneNumbers"),
            {
                MobileNumber: mobileNumber,
                HomeNumber: homeNumber,
                WorkNumber: workNumber,
                IsMobilePrimary: isMobilePrimary,
                IsHomePrimary: isHomePrimary,
                IsWorkPrimary: isWorkPrimary
            });
    },
    isAdmin: function () {
        return _get(_getUrl(ACCOUNT_CONTROLLER, "IsAdmin"));
    },
    getUserInformation: function () {

        const d = q.defer(),
            model = kendo.data.DataSource.create({
                transport: {
                    read: {
                        url: _getUrl(ACCOUNT_CONTROLLER, "GetUserContactInformation"),
                        type: "POST"
                    }
                },
                schema: {
                    data: "Data.result",
                    model: aspnet_user
                }
            });

        model.read()
            .done(function () {
                d.resolve(model.data()[0]);
            });

        return d.promise;
    },
    isUserAuthorized: function () {
        return _post(_getUrl(ACCOUNT_CONTROLLER, "IsUserAuthorized"));
    }
};

export const register = {

    submitRegistration: function (firstName,
        lastName,
        emailAddress,
        password,
        securityQuestionOneId,
        securityAnswerOne,
        securityQuestionTwoId,
        securityAnswerTwo) {
        return _post(_getUrl(REGISTER_CONTROLLER, "SubmitRegistration"),
            {
                FirstName: firstName,
                LastName: lastName,
                Email: emailAddress,
                Password: password,
                SecurityQuestionOneID: securityQuestionOneId,
                SecurityAnswerOne: securityAnswerOne,
                SecurityQuestionTwoID: securityQuestionTwoId,
                SecurityAnswerTwo: securityAnswerTwo
            });
    },
    getSecurityQuestions: function () {
        return _get(_getUrl(REGISTER_CONTROLLER, "GetSecurityQuestions"));
    },
    authorizeUser: function (uid) {
        return _post(_getUrl(REGISTER_CONTROLLER, "AuthorizeUser"), { authorizationId: uid });
    }
};

export const management = {

    saveCreditItem: function (creditItem) {

        return _post(_getUrl(MANAGEMENT_CONTROLLER, "SaveCreditItem"), creditItem);
    },
    getCreditItems: function (creditBureau) {
        return _get(_getUrl(MANAGEMENT_CONTROLLER, "GetCreditItems"), { bureau: constants.getCreditBureauId(creditBureau) });
    },
    getCreditItem: function (id) {

        const d = q.defer(),
            model = kendo.data.DataSource.create({
                transport: {
                    read: {
                        url: _getUrl(MANAGEMENT_CONTROLLER, "GetCreditItem"),
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
            });

        model.read()
            .then(function () {

                d.resolve(model.data()[0]);

            });

        return d.promise;
    },
    changeCreditItemResponse: function (creditBureau, status, creditItemId) {
        switch (creditBureau) {
            case constants.creditBureaus.transUnion:
                return _post(_getUrl(MANAGEMENT_CONTROLLER, "ChangeCreditItemResponse"), {
                    creditBureau: 1,
                    creditItemId: creditItemId,
                    response: constants.getCreditBureauResponseId(status)
                });
            case constants.creditBureaus.equifax:
                return _post(_getUrl(MANAGEMENT_CONTROLLER, "ChangeCreditItemResponse"), {
                    creditBureau: 2,
                    creditItemId: creditItemId,
                    response: constants.getCreditBureauResponseId(status)
                });
            case constants.creditBureaus.experian:
                return _post(_getUrl(MANAGEMENT_CONTROLLER, "ChangeCreditItemResponse"), {
                    creditBureau: 3,
                    creditItemId: creditItemId,
                    response: constants.getCreditBureauResponseId(status)
                });
            default:
                break;
        }
    }
};