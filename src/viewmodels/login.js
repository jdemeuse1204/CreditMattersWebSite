import {useView} from 'aurelia-framework';

@useView('../views/login.html')
export class Login {
    loginMessageDisplay = "none";
    loginMessage = "";
    pinDisplay = "none";
    pin = "";
    loginDisplay = "block";
    username = "";
    password = "";
    rememberMe = false;

    submit() {
        
    }

    verifyPin() {

    }
}