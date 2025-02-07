/**
 * Applies the provided CSS string to the document by creating and appending a style element.
 * Also checks if captions should be centered.
 * @param {string} cssString - The CSS rules to apply
 */
function applyCSS(cssString) {
    injectFonts();
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = cssString;
    document.head.appendChild(styleSheet);
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

/**
 * Creates and injects font-face declarations for custom fonts from CDNs
 */
function injectFonts() {
    const googleFontsLink = document.createElement('link');
    googleFontsLink.rel = 'stylesheet';
    googleFontsLink.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&family=PT+Sans+Caption:wght@400;700&family=PT+Serif+Caption:wght@400&family=Cutive+Mono&family=PT+Mono&family=Roboto+Mono&family=Dancing+Script&family=Handlee&family=Permanent+Marker&family=Fredoka+One&family=Bebas+Neue&family=Righteous&family=Comfortaa:wght@400;700&family=Indie+Flower&family=Press+Start+2P&family=Special+Elite&family=Yarndings+20&display=swap';
    document.head.appendChild(googleFontsLink);
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