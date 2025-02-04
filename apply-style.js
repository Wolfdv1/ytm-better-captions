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

function applyCenterFix() {
    const centerFix = `.caption-window {
  left: 50vw !important;
  position: absolute !important;
  transform: translateX(-35vw) !important;
  text-align: left !important;
  margin-left: 0px !important;
  width: 80vw !important;
}`;
    var styleSheetCenter = document.createElement("style");
    styleSheetCenter.type = "text/css";
    styleSheetCenter.innerText = centerFix;
    document.head.appendChild(styleSheetCenter);
}

function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

browser.runtime.onMessage.addListener((request) => {
    if (request.message === "optionsChanged") {
        applyCSS(request.cssString);
    }
});

browser.runtime.sendMessage({ message: "getOptions" }).then((options) => {
    applyCSS(options);
});