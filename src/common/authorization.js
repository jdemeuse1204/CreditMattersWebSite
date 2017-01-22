import { account } from './repository';
import { loginResults } from '../constants';
import moment from "moment";
import { isEmpty } from 'lodash';
import ls from "./localStorage";
import * as environment from '../environment';

export function login(username, password, rememberMe = false) {

    return new Promise((resolve, reject) => {

        account.login(username, password).then(data => {

            switch (data.Data.result.SignInStatus) {
                case 0: // Success
                    processLogin(data.Data.result.Token,
                        rememberMe,
                        username,
                        resolve);
                    break;
                default:
                case 1: // Fail
                    reject(loginResults.failed);
                    break;
                case 2: // LockedOut
                    reject(loginResults.lockedOut);
                    break;
                case 3: // RequiresAccountVerification
                    reject(loginResults.requiresVerification);
                    break;
                case 4: // Has Temporary Password
                    reject(loginResults.hasTemporaryPassword);
                    break;
                case 5: // Needs 2FA Verification
                    reject(loginResults.requiresDeviceVerification);
                    break;
            }
        });
    });
}

export function setAuthorizationToken(token) {
    ls.set(token, environment.authorizationTokenKey);
}

export function getAuthorizationToken() {

    try {

        const token = ls.get(environment.authorizationTokenKey);

        if (isEmpty(token)) {
            return "";
        }
        return token;
    } catch (error) {
        return "";
    }
}

export function setDeviceAuthorizationToken(token) {
    ls.set(token, environment.deviceTokenKey);
}

export function getDeviceAuthorizationToken(token) {

    try {

        const token = ls.get(environment.deviceTokenKey);

        if (isEmpty(token)) {
            return "";
        }
        return token;
    } catch (error) {
        return "";
    }
}

export function logout() {
    ls.remove(environment.authorizationTokenKey);
}

export function getClaims(token) {

    const base64UrlDecode = (payload) => {

        payload = payload.replace(new RegExp('-', 'g'), '+');
        payload = payload.replace(new RegExp('_', 'g'), '/');

        switch (payload.length % 4) {
            case 0:
                break; // No pad chars in this case
            case 2:
                payload += "==";
                break; // Two pad chars
            case 3:
                payload += "=";
                break; // One pad char
            default:
                throw new Exception("Illegal base64url string!");
        };

        return atob(payload);
    };
    var parts = token.split('.');
    return JSON.parse(base64UrlDecode(parts[1]));
}

export function setRememberedUsername(username) {
    ls.set(username, environment.rememberMeKey);
}

export function getRememberedUsername() {

    const username = ls.get(environment.rememberMeKey);

    if (isEmpty(username)) {
        return "";
    }

    return username;
}

export function forgetRememberedUser() {
    ls.remove(environment.rememberMeKey);
}

export function cleanAuthorizationToken() {
    const authToken = getAuthorizationToken();

    if (!!authToken && authToken.split('.').length != 3) {
        ls.remove(environment.authorizationTokenKey);
    }
}

export function cleanDeviceToken() {
    const deviceToken = getDeviceAuthorizationToken();

    if (!!deviceToken && deviceToken.split('.').length != 3) {
        ls.remove(environment.deviceTokenKey);
    }
}

function processLogin(token, rememberMe, username, resolve) {

    if (rememberMe === true) {
        setRememberedUsername(username);
    } else {
        // forget the user
        forgetRememberedUser();
    }

    resolve({
        message: loginResults.success,
        token: token
    });
}