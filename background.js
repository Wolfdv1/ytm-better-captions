browser.runtime.onMessage.addListener((request) => {
    if (request.message == "optionsChanged") {
        browser.tabs.query({}, (tabs) => {
            for (const tab of tabs) {
                browser.tabs.sendMessage(tab.id, { message: request.message, options: request.options });
            }
        });
    }
});

browser.action.onClicked.addListener( () => {
    browser.runtime.openOptionsPage()
});