import {useView} from 'aurelia-framework';

@useView('../views/layouts/layout.html')
export class Layout {
    constructor() {

    }
}



// Module require
import template from "html!v/layouts/layout.html";
import drawer from "../../controllers/drawer";


let viewModel = kendo.observable({
        userLoggedInMessage: "",
        setLoggedInMessage: function(firstName) {
            this.set("userLoggedInMessage", "Hello {0}".format(firstName));
        },
        logoutClick: function() {
            core.logout();
        },
        userProfileClick: function() {
            window.location.href = "#!/Management/MyProfile";
        },
        renderPackage: function() {
            return [
                { layoutPath: "", contentsPath: "\\viewmodels\\layouts\\layout", showIn: "" }
            ];
        }
    }),
    layout = new kendo.Layout(template,
    {
        model: viewModel,
        init: function() {

            repository.account.isAdmin()
                .then(function(response) {

                    if (response.Data.success === true) {

                        const model = { url: "#!/Admin/Home" },
                            template = $.getTemplate("#layout-header-mobile-admin-options", model);

                        $("#layout-admin-options").replaceWith(template);
                        return;
                    }

                    $("#layout-admin-options").empty();
                    $("#layout-admin-options").remove();
                });

            drawer.initialize();

            const loginFunctions = core.getLoginFunctions();
            // set logged in message
            const token = loginFunctions.getToken();

            viewModel.setLoggedInMessage(token.firstName);
        },
        show: function() {

            // page must be rendered first
            drawer.listenForRouteChange();
        }
    }),
    router,
    core,
    repository;

export default function(mRouter, mCore, mRepository) {

    // set the router on the main view model
    router = mRouter;
    core = mCore;
    repository = mRepository;

    return layout;
};