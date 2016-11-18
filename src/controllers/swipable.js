// Scope require
import '../../node_modules/kendo-ui-core/js/kendo.touch';

export default function(cmSwipableSelector, _onRightAction, _onLeftAction, _onTapAction) {

    const _leftActionClick = function(e) {

            if ($.isFunction(_onLeftAction)) {

                e["direction"] = "left";

                _onLeftAction(e);

                _reset($(cmSwipableSelector), $(_overlaySelector));
            }
        },
        _rightActionClick = function(e) {

            if ($.isFunction(_onRightAction)) {

                e["direction"] = "right";

                _onRightAction(e);

                _reset($(cmSwipableSelector), $(_overlaySelector));
            }

        },
        _onTap = function(e) {

            if ($.isFunction(_onTapAction)) {

                // needed so click event
                // doesnt bubble to dialog
                e.preventDefault();
                _onTapAction(e);

                _reset($(cmSwipableSelector), $(_overlaySelector));
            }

        },
        _overlaySelector = cmSwipableSelector + " .cm-swipable-drag-overlay",
        _leftActionSelector = cmSwipableSelector + " .cm-swipable-left-action",
        _rightActionSelector = cmSwipableSelector + " .cm-swipable-right-action",
        _reset = function(parent, overlay) {
            parent.addClass("no-drag");
            parent.removeClass("drag-right");
            parent.removeClass("drag-left");
            overlay.css("left", 0);
        };

    // call left action
    $(_leftActionSelector).unbind("click");
    $(_leftActionSelector).on("click", _leftActionClick);

    // call right action
    $(_rightActionSelector).unbind("click");
    $(_rightActionSelector).on("click", _rightActionClick);

    $(cmSwipableSelector)
        .find(".cm-swipable-drag-overlay")
        .kendoTouch({
            wasDragging: "",
            dragStartXPosition: 0,
            drag: function(e) {

                const left = e.sender.element.position().left,
                    parent = e.sender.element.parent();

                if (left > 0) {
                    // dragging-left
                    if (parent.hasClass("no-drag")) {
                        parent.removeClass("no-drag");
                    }

                    if (!parent.hasClass("drag-left")) {
                        parent.addClass("drag-left");
                    }

                    if (parent.hasClass("drag-right")) {
                        parent.removeClass("drag-right");
                    }
                }

                //drag-right
                if (left < 0) {
                    // dragging right
                    if (parent.hasClass("no-drag")) {
                        parent.removeClass("no-drag");
                    }

                    if (!parent.hasClass("drag-right")) {
                        parent.addClass("drag-right");
                    }

                    if (parent.hasClass("drag-left")) {
                        parent.removeClass("drag-left");
                    }
                }

                e.sender.element.css("left", left + e.touch.x.delta);
            },
            tap: function(e) {

                if (!$(e.event.target).is("div")) {
                    return;
                }

                const $currentTarget = $(e.event.currentTarget).parent(),
                    didDrag = this.wasDragging;

                if ($currentTarget.hasClass("drag-right") ||
                    $currentTarget.hasClass("drag-left") ||
                    didDrag === true) {
                    e.preventDefault();
                    return;
                }

                // element was tapped only
                _onTap(e);
            },
            dragend: function(e) {

                let mainContainerWidth = $(_overlaySelector).css("width"),
                    parsedWidth = parseInt(mainContainerWidth.replace("px", "")),
                    left = e.sender.element.position().left,
                    movePercentage = (left / parsedWidth),
                    parent = e.sender.element.parent(),
                    setDrag = function() {
                        $(_overlaySelector).data("kendoTouch").wasDragging = false;
                    };

                if (left !== 0) {

                    this.wasDragging = true;

                    setTimeout(setDrag, 100);
                }

                // negative - right is showing, 25% show button, 50% perform action
                // positive - left is showing, 25% show button, 50% perform action

                if (movePercentage < .25 && movePercentage > 0) {
                    // reset
                    _reset(parent, e.sender.element);
                    return;
                }

                if (movePercentage > -.25 && movePercentage < 0) {
                    // reset
                    _reset(parent, e.sender.element);
                    return;
                }

                if (movePercentage >= .25 && movePercentage < .5) {
                    // show done action
                    e.sender.element.css("left", (parsedWidth * .25));

                    return;
                }

                if (movePercentage >= .5) {
                    // perform left action

                    if ($.isFunction(_onLeftAction)) {

                        e["direction"] = "left";

                        _onLeftAction(e);

                        _reset(parent, e.sender.element);
                    }

                    return;
                }

                if (movePercentage <= -.25 && movePercentage > -.5) {
                    // show send to CDS action
                    e.sender.element.css("left", -(parsedWidth * .25));

                    return;
                }

                if (movePercentage <= -.5) {
                    // perform right action

                    if ($.isFunction(_onRightAction)) {

                        e["direction"] = "right";

                        _onRightAction(e);

                        _reset(parent, e.sender.element);
                    }

                    return;
                }
            }
        });
};