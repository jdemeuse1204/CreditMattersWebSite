import { inject } from 'aurelia-dependency-injection';
import { DialogController } from 'aurelia-dialog';
import { ValidationControllerFactory, ValidationRules } from 'aurelia-validation';
import { CMRenderer } from '../common/cmRenderer';
import { account } from '../common/repository';
import * as validate from '../common/cmValidate';
import * as loadingScreen from "../common/loadingScreen";

@inject(DialogController, ValidationControllerFactory)
export class ChangePasswordModal {

    controller = null;
    model = null;
    confirmNewPassword = "";
    oldPassword = "";
    newPassword = "";

    constructor(controller, controllerFactory) {
        this.controller = controller;

        this.validationController = controllerFactory.createForCurrentScope();
        this.validationController.addRenderer(new CMRenderer());

        const matchesNewPassword = (oldPassword) => {

            if (!!oldPassword) {
                return this.newPassword === oldPassword;
            }

            return false;
        };

        this.rules = ValidationRules
            .ensure('oldPassword').required()
            .ensure('newPassword').displayName("New Password").satisfies(w => validate.isPasswordCorrectLength(w)).withMessage(`\${$displayName} must be 8 characters long.`)
            .ensure('pasnewPasswordsword').displayName("New Password").satisfies(w => validate.containsCapitalLetter(w)).withMessage(`\${$displayName} contain an uppercase character.`)
            .ensure('newPassword').displayName("New Password").satisfies(w => validate.containsNumber(w)).withMessage(`\${$displayName} contain a number.`)
            .ensure('newPassword').displayName("New Password").satisfies(w => validate.containsSpecialCharacter(w)).withMessage(`\${$displayName} contain a special character.`)
            .ensure('confirmNewPassword').satisfies(w => matchesNewPassword(w)).withMessage(`Must match New Password`)
            .on(this)
            .rules;
    }

    activate(model) {
        this.model = model
    }

    save() {

        validate.validate(this.controller).then(() => {

            //loadingScreen.show();
            //account

        }).catch(() => {

        });
    }
}