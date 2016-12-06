export function show() {
        // show the loading screen
    let loadingScreenElement = $("#cm-loading-screen");
    const body = $("body");

    if (loadingScreenElement.length === 0) {
        loadingScreenElement = $('<div id="cm-loading-screen" class="loading-screen"><img src="Content/images/loading-image.gif"></img></div>');
    }

    loadingScreenElement.appendTo(body);

}

export function hide() {
    const loadingScreenElement = $("#cm-loading-screen");
    loadingScreenElement.css('display', 'none');
}

