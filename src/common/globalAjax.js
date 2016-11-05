// Module require
import * as _ from "lodash";
import loginFunctions from "./loginFunctions";


export default function (core) {
    let _xhrPool = [],
        _abort = function() { $.each(_xhrPool, function(idx, jqXHR) { jqXHR.abort(); }); },
        _oldbeforeunload = window.onbeforeunload,
        _loginFunctions = loginFunctions(365, "d8b51be9-35ae-4add-aa59-b2705cf2f56a"),
        _message;
        
    // never cache ajax requests
    $.ajaxSetup({ cache: false }); 

    $(document)
        .ajaxStart($.noop)
        .ajaxStop(function () {
            _xhrPool = [];
        })
        .ajaxSend(function (e, jqXhr) {

            let _xsrfToken = $(":hidden[name=\"__RequestVerificationToken\"]").val(),
                _tokenData = _loginFunctions.getToken(),
                _jwt = _tokenData.token;

            // set custom headers
            jqXhr.setRequestHeader("X-Requested-With", "XMLHttpRequest"); // header is not set by safari, must set this
            jqXhr.setRequestHeader("X-CSRF-Token", _xsrfToken);
            jqXhr.setRequestHeader("Authorization", kendo.format("Bearer{0}", _jwt));

            _xhrPool.push(jqXhr);
        })
        .ajaxComplete(function (e, jqXhr) {
            let _json = jqXhr.responseJSON,
                _success = _.has(_json, "success") ? _json.success : true;

            _message = _.has(_json, "message") ? _json.message : "Unspecified Error";
            _xhrPool = $.grep(_xhrPool, function (x) { return x !== jqXhr; });

            switch (jqXhr.status) {
                case 200: //Respond to an exception on the server
                    if (!!_json && _success === false) {
                        _abort();
                    }
                    break;
                case 401:

                    _abort();
                    kendo.ui.progress($("#main-layout-page"), false);

                    // not authorized, show login screen,
                    // do location replace so back button cannot be used
                    location.replace("#!/Login");
                    break;
                case 400:
                case 403://forbidden
                case 404:
                case 500:
                    _abort();
                    // error page
                default:
                    break;
            }
        })
        .ajaxError(function (e, jqXhr) {

            core.error = jqXhr.statusText;

            // navigate to error page
            location.href = "#!/Error";
        });


    window.onbeforeunload = function () {

        const r = _oldbeforeunload ? _oldbeforeunload() : undefined;

        if (r === undefined) {
            // only cancel requests if there is no prompt to stay on the page
            // if there is a prompt, it will likely give the requests enough time to finish
            _abort();
        }
        return r;
    };
};