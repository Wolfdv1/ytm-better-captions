function applyCSS(options) {
    const background = hexToRgba(options.background, options.backgroundAlpha / 100);
    const colour = hexToRgba(options.colour, options.colourAlpha / 100);
    const shadow = options.shadowType === "none" ? "none" : `${hexToRgba(options.shadowColour, options.shadowAlpha / 100)} 1px 1px 2px`;

    const CSS = `
        .ytp-caption-segment {
            display: inline-block !important;
            white-space: pre-wrap !important;
            background: ${background} !important;
            color: ${colour} !important;
            fill: ${colour} !important;
            text-shadow: ${shadow} !important;
            font-family: ${options.fontFamily} !important;
        }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = CSS;
    document.head.appendChild(styleSheet);
}

function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

browser.runtime.onMessage.addListener((request) => {
    if (request.message === "optionsChanged") {
        applyCSS(request.options);
    }
});

browser.runtime.sendMessage({ message: "getOptions" }).then((options) => {
    applyCSS(options);
});