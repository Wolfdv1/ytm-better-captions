function applyCSS(options) {
    const CSS = `
        .ytp-caption-segment {
            display: inline-block !important;
            white-space: pre-wrap !important;
            background: ${options.background} !important;
            font-size: ${options.fontSize}px !important;
            color: ${options.colour} !important;
            fill: ${options.colour} !important;
            text-shadow: ${options.shadowType === "none" ? "none" : `${options.shadowColour} 1px 1px 2px`} !important;
            font-family: ${options.fontFamily} !important;
        }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = CSS;
    document.head.appendChild(styleSheet);
}

browser.runtime.onMessage.addListener((request) => {
    if (request.message === "optionsChanged") {
        applyCSS(request.options);
    }
});