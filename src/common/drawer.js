// Scope require
import '../../node_modules/kendo-ui-core/js/kendo.mobile.drawer';

let _mobileDrawer,
    _listenForRouteChange = function() {
        const listItems = _getListItems();
        const location = window.location.hash;

        // activate correct button depending on the route;
        // deactivate current route
        _removeActiveLink();

        // activate thje current route
        for (let i = 0; i < listItems.length; i++) {
            const item = listItems[i];
            if ($(item).attr("route") === location) {
                $(item).addClass("active-selection");
            }
        }
    },
    _getListItems = function() {
        return $("#main-layout-page .drawer li");
    },
    _removeActiveLink = function() {
        _getListItems().removeClass("active-selection");
    },
    _expand = function() {

        _mobileDrawer.show();
    },
    _collapse = function() {

        _mobileDrawer.hide();
    },
    _isDesktop = function() {
        return document.documentElement.clientWidth >= 992;
    },
    _processClientWidth = function() {

        if (_isDesktop()) {

            _collapse();

            return;
        }
    },
    _createMobileDrawer = function() {

        let mobileDrawer = $("#mobile-drawer").data("kendoMobileDrawer");

        if (!mobileDrawer) {
            mobileDrawer = $("#mobile-drawer")
                .kendoMobileDrawer({
                    container: "#main-layout-content",
                    swipeToOpen: false
                })
                .data("kendoMobileDrawer");
        }

        return mobileDrawer;
    },
    _initialize = function() {

        _mobileDrawer = _createMobileDrawer();

        // need to process width on load and on resize otherwise
        // drawer will be hidden on load
        _processClientWidth();

        $(window).unbind("resize");
        $(window)
            .on("resize",
                function() {
                    _processClientWidth();
                });

        $("#drawer-trigger").unbind("click");
        $("#drawer-trigger")
            .on("click",
                function() {

                    if (_mobileDrawer.visible) {
                        _collapse();
                        return;
                    }

                    _expand();
                });
    };

let returnModel = {
    listenForRouteChange: _listenForRouteChange,
    expand: _expand,
    collapse: _collapse,
    initialize: _initialize
};

export default returnModel;