/**
 * Applies the provided CSS string to the document by creating and appending a style element.
 * Also checks if captions should be centered.
 * @param {string} cssString - The CSS rules to apply
 */
function applyCSS(cssString) {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = cssString;
    document.head.appendChild(styleSheet);
    browser.runtime.sendMessage({ message: "centerCaptions" }).then((centered) => {
        if (centered) {
            applyCenterFix();
        }
    });
}

/**
 * Applies CSS fixes for centering captions by adding additional styles.
 */
function applyCenterFix() {
    
    const centerFix =`
    .caption-window {
        width: 95vw !important;
        left: 2.5vw !important;
        margin-left: 0vw !important;
        border-left-width: 0vw !important;
    }
    .ytp-caption-window-container {
        width: 100vw !important;
    }`;

    var styleSheetCenter = document.createElement("style");
    styleSheetCenter.type = "text/css";
    styleSheetCenter.innerText = centerFix;
    document.head.appendChild(styleSheetCenter);
}

/**
 * Converts a hex color code to an RGBA color string
 * @param {string} hex - The hex color code (e.g. "#FF0000")
 * @param {number} alpha - The opacity value between 0 and 1
 * @returns {string} RGBA color string
 */
function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Listen for options changes from the background script
browser.runtime.onMessage.addListener((request) => {
    if (request.message === "optionsChanged") {
        applyCSS(request.cssString);
    }
});

// Initially fetch and apply options when content script loads
browser.runtime.sendMessage({ message: "getOptions" }).then((options) => {
    applyCSS(options);
});