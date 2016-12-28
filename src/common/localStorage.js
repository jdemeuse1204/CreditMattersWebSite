let _get = function(key) {

        var item = localStorage.getItem(key);

        return JSON.parse(item || "{}");
    },
    _remove = function(key) {
        return localStorage.removeItem(key);
    },
    _set = function(data, key) {

        const rawDataString = JSON.stringify(data || "");

        localStorage.setItem(key, rawDataString);
    },
    _finalModel = {
        get: _get,
        remove: _remove,
        set: _set
    };

export default _finalModel;