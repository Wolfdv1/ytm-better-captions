browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === "optionsChanged") {
        browser.tabs.query({}, (tabs) => {
            for (const tab of tabs) {
                browser.tabs.sendMessage(tab.id, { message: request.message, options: request.options });
            }
        });
    } else if (request.message === "getOptions") {
        browser.storage.sync.get([
            "background",
            "backgroundAlpha",
            "fontSize",
            "colour",
            "colourAlpha",
            "shadowType",
            "shadowColour",
            "shadowAlpha",
            "fontFamily",
        ]).then((res) => {
            sendResponse({
                background: res.background || "#080808",
                backgroundAlpha: res.backgroundAlpha || "75",
                fontSize: res.fontSize || "14",
                colour: res.colour || "#ffffff",
                colourAlpha: res.colourAlpha || "100",
                shadowType: res.shadowType || "none",
                shadowColour: res.shadowColour || "#080808",
                shadowAlpha: res.shadowAlpha || "100",
                fontFamily: res.fontFamily || "YouTube Noto, Roboto, Arial, Helvetica, Verdana, PT Sans Caption, sans-serif",
            });
        });
        return true;
    }
});

browser.action.onClicked.addListener(() => {
    browser.runtime.openOptionsPage();
});