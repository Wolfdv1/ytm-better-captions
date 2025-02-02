browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === "optionsChanged") {
        browser.tabs.query({}, (tabs) => {
            browser.storage.sync.get("cssString").then((res) => {
                for (const tab of tabs) {
                    browser.tabs.sendMessage(tab.id, { message: request.message, cssString: res.cssString });
                }
            });
        });
    } else if (request.message === "getOptions") {
        browser.storage.sync.get("cssString").then((res) => {
            sendResponse(res.cssString);
        });
        return true;
    } else if (request.message === "centerCaptions") {
        browser.storage.sync.get("centerCaptions").then((res) => {
            sendResponse(res.centerCaptions);
        });
        return true;
    }

});

browser.action.onClicked.addListener(() => {
    browser.runtime.openOptionsPage();
});