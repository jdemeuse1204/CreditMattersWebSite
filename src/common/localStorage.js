let _get = function(key, securityPhrase) {

        const rawData = _getRawData(key);

        if (!!rawData) {
            const decryptedString = _decrypt(rawData, securityPhrase);

            return JSON.parse(decryptedString);
        }

        return null;
    },
    _remove = function(key) {
        return localStorage.removeItem(key);
    },
    _set = function(data, tokenName, securityPhrase) {

        const rawDataString = JSON.stringify(data),
            storageData = _encrypt(rawDataString, securityPhrase);

        localStorage.setItem(tokenName, storageData);
    },
    _encrypt = function(stringArray, securityPhrase) {
        return CryptoJS.AES.encrypt(stringArray, securityPhrase).toString();
    },
    _decrypt = function(stringArray, securityPhrase) {
        return CryptoJS.AES.decrypt(stringArray, securityPhrase).toString(CryptoJS.enc.Utf8);
    },
    _getRawData = function(tokenName) {
        return localStorage.getItem(tokenName);
    },
    _finalModel = {
        get: _get,
        remove: _remove,
        set: _set
    };

export default _finalModel;