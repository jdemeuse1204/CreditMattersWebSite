import { account } from './repository';
import {loginResults} from '../constants';
import loginFunctions from './loginFunctions';

export function login(username, password, rememberMe = false) {
debugger;
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

    loginFunctions(1000, "sfsdf").rememberDevice(username);

}

function processLogin(token, firstName, addressCompletedDateTime, rememberMe, username, resolve, reject) {

    if (rememberMe) {
        loginFunctions(1000, "sfsdf").setRememberedUsername(username);
    } else {
        // forget the user
        loginFunctions(1000, "sfsdf").forgetRememberedUser();
    }

    const deviceNeedsAuthorization = loginFunctions(1000, "sfsdf").deviceNeedsAuthorization(username);

    if (deviceNeedsAuthorization === true) {
        reject(loginResults.requiresDeviceVerification);
    }

    resolve(loginResults.success, token, firstName, addressCompletedDateTime)
}