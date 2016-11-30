// Module require
import loginFunctions from "./loginFunctions";

export default function (core) {

    // never cache ajax requests
    $.ajaxSetup({ cache: false }); 

    $(document)
        .ajaxStart($.noop)
        .ajaxSend(function (e, jqXhr) {

            const _xsrfToken = $(":hidden[name=\"__RequestVerificationToken\"]").val(),
                _tokenData = loginFunctions(1000).getToken(),
                _jwt =  !!_tokenData ? _tokenData.token || "" : "";

            // set custom headers
            jqXhr.setRequestHeader("X-Requested-With", "XMLHttpRequest"); // header is not set by safari, must set this
            //jqXhr.setRequestHeader("X-CSRF-Token", _xsrfToken);
            jqXhr.setRequestHeader("Authorization", kendo.format("Bearer{0}", _jwt));
        });

};