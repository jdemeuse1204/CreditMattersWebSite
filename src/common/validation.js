export default function () {

    $.fn.ValidateLite = function (options) {

        let hasError = false;

        const successIcon = "fa-check",
            initIcon = "fa-asterisk",
            failIcon = "fa-exclamation-triangle",
            lockIcon = "fa-lock",
            fontErrorInit = "v-error",
            fontSuccess = "v-success",
            id = this.attr("id"),
            data = $(id).data("ValidateLite"),
            $input = this.find("input"),
            $i = this.find("i"),
            $div = this,
            doesHaveError = function () {
                const value = $input.val();

                return value === "" || value == null ? true : false;
            },
            showSuccess = function () {
                $i.addClass(successIcon);
                $div.addClass(fontSuccess);
            },
            showError = function () {
                $i.addClass(failIcon);
                $div.addClass(fontErrorInit);

                return hasError;
            },
            removeAllClasses = function () {
                $i.removeClass(successIcon).removeClass(initIcon).removeClass(failIcon).removeClass(lockIcon);
                $div.removeClass(fontSuccess).removeClass(fontErrorInit);
            },
            model = {
                process: function (value) {

                    if (value != null) {
                        hasError = value;
                    } else {
                        hasError = doesHaveError();
                    }

                    removeAllClasses();

                    if (hasError === true) {
                        // put on error icon
                        showError();

                        return hasError;
                    }

                    // put on success icon
                    showSuccess();

                    return hasError;
                },
                reset: function () {

                    removeAllClasses();
                    $i.addClass(initIcon);
                    $div.addClass(fontErrorInit);
                    $input.removeAttr("readonly");

                },
                value: function () {
                    return $input.val();
                },
                hasError: hasError,
                readOnly: function (option) {

                    removeAllClasses();

                    if (option === true) {
                        $i.addClass(lockIcon);
                        $input.attr("readonly", "readonly");
                        return;
                    }

                    $input.removeAttr("readonly");
                    this.process();
                }
            };


        if (data) {
            data.reset();
            return data;
        } else {
            model.reset();
        }

        $input.unbind("keyup");
        $input.on("keyup", model.process);

        this.data("ValidateLite", model);

        $div.addClass(fontErrorInit);

        if (doesHaveError() === false) {
            removeAllClasses();
            showSuccess();
        }

        if (options && options.readOnly === true) {
            model.readOnly(true);
        }

        return model;
    };

    $.fn.Validate = function (options) {

        var id = this.attr("id"),
            formattedId = "#{0}".format(id),
            mainSelector = "{0}_main",
            divElement = $(formattedId),
            inputElement = $(divElement.find("input")[0]),
            errorTemplate = "<span class='{0}' style='display: {1}' data-name='{2}'>{3}</span>",
            defaultInitMainClass = "fa fa-asterisk form-control-feedback password-required",
            defaultChildMainClass = "fa fa-asterisk password-required",
            defaultSuccessClass = "glyphicon-ok password-success",
            defaultFailClass = "glyphicon-alert password-fail",
            initClass = "glyphicon-pencil password-required",
            _hasError = false,
            data = $(formattedId).data("Validate");

        if (data) {
            data.reset();
            return data;
        }

        if (divElement.length === 0) {
            throw new Error("Element not found: {0}".format(id));
        }

        if (!divElement.is("div")) {
            throw new Error("Element is not a div: {0}".format(id));
        }

        if (_.isEmpty(options.mainValidator.initClass)) {
            options.mainValidator.initClass = defaultInitMainClass;
        }

        if (_.isEmpty(options.mainValidator.failClass)) {
            options.mainValidator.failClass = defaultFailClass;
        }

        if (_.isEmpty(options.mainValidator.successClass)) {
            options.mainValidator.successClass = defaultSuccessClass;
        }

        var processValidation = function (value, validatorType) {

            if (typeof validatorType === "string") {
                switch (validatorType) {
                    case "notempty":
                        return processNotEmpty(value);

                    case "numeric":
                        return $.isNumeric(value);

                    case "email":
                        return $.isEmailAddress(value);

                    case "containsuppercase":
                        return $.hasCapitalLetter(value);

                    case "containsspecial":
                        return $.hasSpecialCharacter(value);

                    case "containsnumber":
                        return $.hasNumber(value);

                    default:
                        break;
                }

            } else if (typeof validatorType === "number") {
                return value.length >= validatorType;
            } else {
                var matchContainerElement = $("#{0}".format(validatorType.elementId)),
                    matchElement = $(matchContainerElement.find("input")[0]),
                    matchValue = matchElement.val();

                if (_.isEmpty(matchValue) || _.isEmpty(value)) {
                    return false;
                }

                return matchElement.val() === value;
            }

        },
            value = function () {
                return inputElement.val();
            },
            processor = function () {

                // process any children first
                var hasChildValidators = options.validators !== undefined,
                    value = inputElement.val(),
                    mainValidationElement = $("#{0} [data-name='{1}']".format(id, getMainDataName())); // find the main element (input)

                if (hasChildValidators) {
                    var failCount = 0,
                        childContainerId = "{0}_childValidatorContainer".format(id),
                        childListId = "{0}_validationList".format(id),
                        childContainer = $("#{0}".format(childContainerId));

                    if (childContainer.length === 0) {
                        // create child conatiner
                        $("<div id='{0}' class='requirements-container' style='width:100%;'><ul id='{1}'></ul></div>".format(childContainerId, childListId)).appendTo(divElement);
                    }

                    var list = $("#{0}".format(childListId));

                    for (var i = 0; i < options.validators.length; i++) {
                        var child = options.validators[i],
                            isChildValid = validate(value, child.validate),
                            dataName = getDataName(i),
                            childId = "span[data-name='{0}']".format(dataName),
                            childElement = $(childId),
                            childErrorMessage = child.errorMessage;

                        if (_.isEmpty(child.initClass)) {
                            child.initClass = defaultChildMainClass;
                        }

                        if (_.isEmpty(child.failClass)) {
                            child.failClass = defaultFailClass;
                        }

                        if (_.isEmpty(child.successClass)) {
                            child.successClass = defaultSuccessClass;
                        }

                        if (childElement.length === 0) {
                            $("<li><span data-name='{0}' class='password-requirement'><i class='{1}'></i>&nbsp&nbsp;{2}</span></li>".format(dataName, child.initClass, childErrorMessage)).appendTo(list);
                        }

                        childElement = $($(childId).find("i")[0]);

                        if (!isChildValid) {
                            // validation failed

                            fail(childElement, child.failClass, child.successClass);

                            failCount++;
                        } else {
                            // validation passed

                            success(childElement, child.failClass, child.successClass);
                        }

                        if (failCount === 0) {

                            success(mainValidationElement, options.mainValidator.failClass, options.mainValidator.successClass);
                            $("#{0}".format(childContainerId)).css("display", "none");
                        } else {

                            fail(mainValidationElement, options.mainValidator.failClass, options.mainValidator.successClass);
                            $("#{0}".format(childContainerId)).css("display", "block");
                        }
                    }

                    var error = failCount === 0;

                    model.hasError = !error;

                    return error;
                } else {

                    // validate the main element
                    if (!validate(value, options.mainValidator.validate)) {
                        // validation failed

                        fail(mainValidationElement, options.mainValidator.failClass, options.mainValidator.successClass);

                        var error = false;

                        model.hasError = !error;

                        return error;
                    } else {
                        // validation passed
                        success(mainValidationElement, options.mainValidator.failClass, options.mainValidator.successClass);

                        var error = true;

                        model.hasError = !error;

                        return error;
                    }
                }
            },
            validate = function (value, v) {
                if ($.isFunction(v)) {
                    // call validate
                    return v(value);
                } else {
                    return processValidation(value, v);
                }
            },
            processNotEmpty = function (value) {
                return value !== undefined && value !== null && value !== "";
            },
            getDataName = function (name) {
                return "{0}_{1}".format(id, name);
            },
            fail = function (element, failClass, successClass) {

                if (element.hasClass(failClass)) {
                    return;
                }

                element.removeClass(initClass);
                element.removeClass(successClass);
                element.addClass(failClass);
            },
            success = function (element, failClass, successClass) {

                if (element.hasClass(successClass)) {
                    return;
                }

                element.removeClass(initClass);
                element.removeClass(failClass);
                element.addClass(successClass);
            },
            getMainDataName = function () {
                return mainSelector.format(id);
            },
            init = function () {
                // remove any span or div children because it was already initialized if they are there
                if (divElement.find("span").length === 0 && divElement.find("div").length === 0) {
                    // show init class
                    $(errorTemplate.format(options.mainValidator.initClass, "block", getMainDataName(), "")).appendTo(divElement);
                }
            },
            reset = function () {

                divElement.find("input").val("");
                divElement.find("span.form-control-feedback").remove();
                divElement.find("div").remove();

                const span = divElement.find("span");

                if (!span.hasClass(initClass)) {
                    span.removeClass(defaultFailClass);
                    span.removeClass(defaultSuccessClass);
                    span.addClass(initClass);
                }

                init();
            };

        init();

        var input = this.find("input");

        if (options.fireOnKeyUp === true) {

            input.unbind("keyup");

            if ($.isFunction(options.onKeyUp)) {

                input.on("keyup", options.onKeyUp);

            } else {
                input.on("keyup", processor);
            }
        }

        if (options.fireOnKeyDown === true) {

            input.unbind("keydown");

            if ($.isFunction(options.onKeyDown)) {

                input.on("keydown", options.onKeyDown);

            } else {
                input.on("keydown", processor);
            }
        }

        if (options.fireOnBlur === true) {

            input.unbind("blur");

            if ($.isFunction(options.onKeyUp)) {

                input.on("blur", options.onKeyUp);

            } else {
                input.on("blur", processor);
            }
        }

        var model = {
            process: function () {
                return processor();
            },
            reset: function () {
                return reset();
            },
            value: function (newValue) {
                return value(newValue);
            },
            hasError: _hasError
        };

        $(formattedId).data("Validate", model);

        return model;
    };

}