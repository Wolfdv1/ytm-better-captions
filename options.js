async function saveOptions(event) {
    event.preventDefault();
    const options = {
        background: document.querySelector("#background").value,
        backgroundAlpha: document.querySelector("#background-alpha").value,
        colour: document.querySelector("#colour").value,
        colourAlpha: document.querySelector("#colour-alpha").value,
        shadowType: document.querySelector("#shadow-type").value,
        shadowColour: document.querySelector("#shadow-colour").value,
        shadowAlpha: document.querySelector("#shadow-alpha").value,
        fontFamily: document.querySelector("#font-family").value,
        centerCaptions: document.querySelector("#center-captions").checked
    };
    const cssString = {cssString: generateCSS(options)};
    await browser.storage.sync.set(cssString);
    await browser.storage.sync.set(options);
    browser.runtime.sendMessage({
        message: "optionsChanged",
        cssString: cssString
    });
}

function generateCSS(options) {
    const backgroundColor = hexToRgba(options.background, options.backgroundAlpha / 100);
    const fontColor = hexToRgba(options.colour, options.colourAlpha / 100);
    const fontFamily = options.fontFamily;
    let shadow;

    const shadowColor = hexToRgba(options.shadowColour, options.shadowAlpha / 100);
    if (options.shadowType === "none") {
        shadow = "none";
    } else if (options.shadowType === "drop-shadow") {
        shadow = `${shadowColor} 1px 1px 2px`;
    } else if (options.shadowType === "outline") {
        shadow = `${shadowColor} 0px 0px 2px, ${shadowColor} 0px 0px 2px, ${shadowColor} 0px 0px 2px, ${shadowColor} 0px 0px 2px, ${shadowColor} 0px 0px 2px`;
    }

    return `
        .ytp-caption-segment {
            background: ${backgroundColor} !important;
            color: ${fontColor} !important;
            text-shadow: ${shadow} !important;
            font-family: ${fontFamily} !important;
        }
    `;
}

function updatePreview() {
    const background = document.getElementById("background").value;
    const backgroundAlpha = document.getElementById("background-alpha").value / 100;
    const colour = document.getElementById("colour").value;
    const colourAlpha = document.getElementById("colour-alpha").value / 100;
    const shadowType = document.getElementById("shadow-type").value;
    const shadowColour = document.getElementById("shadow-colour").value;
    const shadowAlpha = document.getElementById("shadow-alpha").value / 100;
    const fontFamily = document.getElementById("font-family").value;

    let shadow;
    if (shadowType === "none") {
        shadow = "none";
    } else if (shadowType === "drop-shadow") {
        shadow = `${hexToRgba(shadowColour, shadowAlpha)} 1px 1px 2px`;
    } else if (shadowType === "outline") {
        const shadowColor = hexToRgba(shadowColour, shadowAlpha);
        shadow = `${shadowColor} 0px 0px 2px, ${shadowColor} 0px 0px 2px, ${shadowColor} 0px 0px 2px, ${shadowColor} 0px 0px 2px, ${shadowColor} 0px 0px 2px`;
    }

    document.querySelectorAll(".ytp-caption-segment").forEach((segment) => {
        segment.style.background = hexToRgba(background, backgroundAlpha);
        segment.style.color = hexToRgba(colour, colourAlpha);
        segment.style.fill = hexToRgba(colour, colourAlpha);
        segment.style.textShadow = shadow;
        segment.style.fontFamily = fontFamily;
    });
}

async function restoreOptions() {
    const res = await browser.storage.sync.get([
        "background",
        "backgroundAlpha",
        "colour",
        "colourAlpha",
        "shadowType",
        "shadowColour",
        "shadowAlpha",
        "fontFamily",
        "centerCaptions"
    ]);
    document.querySelector("#background").value = res.background || "#080808";
    document.querySelector("#background-alpha").value = res.backgroundAlpha || "75";
    document.querySelector("#colour").value = res.colour || "#ffffff";
    document.querySelector("#colour-alpha").value = res.colourAlpha || "100";
    document.querySelector("#shadow-type").value = res.shadowType || "none";
    document.querySelector("#shadow-colour").value = res.shadowColour || "#080808";
    document.querySelector("#shadow-alpha").value = res.shadowAlpha || "100";
    document.querySelector("#font-family").value = res.fontFamily || "YouTube Noto, Roboto, Arial, Helvetica, Verdana, PT Sans Caption, sans-serif";
    document.querySelector("#center-captions").checked = res.centerCaptions || false;
    updatePreview();
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);

document.getElementById("preset1").addEventListener("click", applyPreset1);
document.getElementById("preset2").addEventListener("click", applyPreset2);
document.getElementById("preset3").addEventListener("click", applyPreset3);

document.getElementById("background").addEventListener("input", updatePreview);
document.getElementById("background-alpha").addEventListener("input", updatePreview);
document.getElementById("colour").addEventListener("input", updatePreview);
document.getElementById("colour-alpha").addEventListener("input", updatePreview);
document.getElementById("shadow-type").addEventListener("input", updatePreview);
document.getElementById("shadow-colour").addEventListener("input", updatePreview);
document.getElementById("shadow-alpha").addEventListener("input", updatePreview);
document.getElementById("font-family").addEventListener("input", updatePreview);

function applyPreset1() {
    document.getElementById("background").value = "#ffffff";
    document.getElementById("background-alpha").value = "25";
    document.getElementById("colour").value = "#00ff00";
    document.getElementById("colour-alpha").value = "100";
    document.getElementById("shadow-type").value = "drop-shadow";
    document.getElementById("shadow-colour").value = "#222222";
    document.getElementById("shadow-alpha").value = "100";
    document.getElementById("font-family").value = "Dancing Script, cursive";
    updatePreview();
}

function applyPreset2() {
    document.getElementById("background").value = "#ffffff";
    document.getElementById("background-alpha").value = "0";
    document.getElementById("colour").value = "#f3cb50";
    document.getElementById("colour-alpha").value = "100";
    document.getElementById("shadow-type").value = "drop-shadow";
    document.getElementById("shadow-colour").value = "#000000";
    document.getElementById("shadow-alpha").value = "94";
    document.getElementById("font-family").value = "Georgia, serif";
    updatePreview();
}

function applyPreset3() {
    document.getElementById("background").value = "#080808";
    document.getElementById("background-alpha").value = "75";
    document.getElementById("colour").value = "#ffffff";
    document.getElementById("colour-alpha").value = "100";
    document.getElementById("shadow-type").value = "none";
    document.getElementById("shadow-colour").value = "#080808";
    document.getElementById("shadow-alpha").value = "100";
    document.getElementById("font-family").value = "YouTube Noto, Roboto, Arial, Helvetica, Verdana, PT Sans Caption, sans-serif";
    updatePreview();
}

function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}