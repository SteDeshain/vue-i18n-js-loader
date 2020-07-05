function mergeNewMessage (originalMessages, newMessage) {
    originalMessages = originalMessages || {};
    if (typeof newMessage === 'object') {
        for (let key in newMessage) {
            if (newMessage.hasOwnProperty(key)) {
                if (typeof newMessage[key] === 'object') {
                    originalMessages[key] = mergeNewMessage(originalMessages[key], newMessage[key]);
                } else {
                    originalMessages[key] = newMessage[key];
                }
            }
        }
        return originalMessages;
    }
    return {};
}

module.exports = function (i18nArray) {
    if (Array.isArray(i18nArray)) {
        let result = {};
        for(let i = 0; i < i18nArray.length; i++) {
            let curObj = JSON.parse(i18nArray[i]);
            mergeNewMessage(result, curObj);
        }

        return result;
    }
}