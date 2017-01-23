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
    display = {
        edit: "",
        result: "none",
        error: "none"
    };

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

    showResult(scope, hasError) {
        scope.display.result = "";
        scope.display.edit = "none";
        scope.display.error = hasError === true ? "" : "none";
    }

    showEdit(scope) {
        scope.display.result = "none";
        scope.display.edit = "";
        scope.display.error = "none";
    }

    back() {
        this.confirmNewPassword = "";
        this.newPassword = "";
        this.oldPassword = "";
        this.validationController.reset();
        this.showEdit(this, false);
    }

    save() {

        const that = this;

        validate.validate(this.validationController).then(() => {

            loadingScreen.show();
            account.changePassword(that.oldPassword, that.newPassword, that.confirmNewPassword).then(response => {

                var status = response.Data.result.Status;
                switch (status) {
                    case 0: // InvalidPassword
                        that.showResult(that, true);
                        that.message = "New password does not meet the complexity requirements.";
                        that.title = "Error";
                        break;
                    case 1: // OldPasswordNotValid
                        that.showResult(that, true);
                        that.message = "Old password not valid.";
                        that.title = "Error";
                        break;
                    default:
                    case 2: // Failed
                        that.showResult(that, true);
                        that.message = "Error changing password.";
                        that.title = "Error";
                        break;
                    case 3: // Success
                        that.showResult(that, false);
                        that.message = "Password successfully changed.  Please use this password next time you login.";
                        that.title = "Success";
                        break;
                };

            }).catch(() => { }).finally(() => {
                loadingScreen.hide();
            });

        }).catch(() => {

        });
    }
}