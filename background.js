/**
 * Message handler for extension communication
 * Supports: optionsChanged, getOptions, centerCaptions
 * @param {Object} request - The message request object
 * @param {Object} sender - Information about message sender
 * @param {Function} sendResponse - Callback to send response
 * @returns {boolean|undefined} True if response is async
 */
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // Handle options being changed in the settings
    if (request.message === "optionsChanged") {
        browser.tabs.query({}, (tabs) => {
            browser.storage.sync.get("cssString").then((res) => {
                // Broadcast changes to all tabs
                for (const tab of tabs) {
                    browser.tabs.sendMessage(tab.id, { 
                        message: request.message, 
                        cssString: res.cssString 
                    });
                }
            });
        });
    } 
    // Handle request for current options
    else if (request.message === "getOptions") {
        browser.storage.sync.get("cssString").then((res) => {
            sendResponse(res.cssString);
        });
        return true; // Indicate async response
    } 
    // Handle request for caption centering preference
    else if (request.message === "centerCaptions") {
        browser.storage.sync.get("centerCaptions").then((res) => {
            sendResponse(res.centerCaptions);
        });
        return true; // Indicate async response
    }
});

// Open options page when extension icon is clicked
browser.action.onClicked.addListener(() => {
    browser.runtime.openOptionsPage();
});