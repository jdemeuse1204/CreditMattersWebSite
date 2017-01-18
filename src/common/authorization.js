import { account } from './repository';
import { loginResults } from '../constants';
import loginFunctions from './loginFunctions';

export function login(username, password, rememberMe = false) {

    return new Promise((resolve, reject) => {

        account.login(username, password).then(data => {

            switch (data.Data.result.SignInStatus) {
                case 0: // Success
                    processLogin(data.Data.result.Token,
                        data.Data.result.FirstName,
                        data.Data.result.AddressCompleteDateTime,
                        rememberMe,
                        username,
                        resolve,
                        reject);
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
            }
        });
    });
}

export function rememberDevice(username) {
    loginFunctions(1000).rememberDevice(username);
}

export function setToken(token, firstName, addressCompletedDateTime) {
    loginFunctions(1000).setToken(token, firstName, addressCompletedDateTime);
}

function processLogin(token, firstName, addressCompletedDateTime, rememberMe, username, resolve, reject) {

    if (rememberMe) {
        loginFunctions(1000).setRememberedUsername(username);
    } else {
        // forget the user
        loginFunctions(1000).forgetRememberedUser();
    }

    // const deviceNeedsAuthorization = loginFunctions(1000).deviceNeedsAuthorization(username);
    const deviceNeedsAuthorization = false;
    if (deviceNeedsAuthorization === true) {
        reject(loginResults.requiresDeviceVerification);
    }

    resolve({
        message: loginResults.success,
        token: token,
        firstName: firstName,
        addressCompletedDateTime: addressCompletedDateTime
    });
}

export function logout() {
    loginFunctions(1000).removeToken();
    window.location = "";
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