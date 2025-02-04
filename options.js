async function saveOptions(event) {
    event.preventDefault();
    const options = {
        background: document.querySelector("#background").getAttribute("value"),
        colour: document.querySelector("#colour").getAttribute("value"),
        shadowType: document.querySelector("#shadow-type").value,
        shadowColour: document.querySelector("#shadow-colour").getAttribute("value"),
        fontFamily: document.querySelector("#font-family").value,
        centerCaptions: document.querySelector("#center-captions").checked
    };
    const cssString = generateCSS(options);
    await browser.storage.sync.set({ cssString, ...options });
    browser.runtime.sendMessage({
        message: "optionsChanged",
        cssString: cssString
    });
}

function generateCSS(options) {
    const backgroundColor = options.background;
    const fontColor = options.colour;
    const fontFamily = options.fontFamily;
    let shadow;
    let extraStyle = '';

    const shadowColor = options.shadowColour;
    if (options.shadowType === "none") {
        shadow = "none";
    } else if (options.shadowType === "raised") {
        shadow = `${shadowColor} 1px 1px 0px, ${shadowColor} 2px 2px 0px, ${shadowColor} 3px 3px 0px`;
    } else if (options.shadowType === "drop-shadow") {
        shadow = `${shadowColor} 2px 2px 3px, ${shadowColor} 2px 2px 4px, ${shadowColor} 2px 2px 5px`;
    } else if (options.shadowType === "depressed") {
        shadow = `${shadowColor} 1px 1px 0px, ${shadowColor} -1px -1px 0px`;
    } else if (options.shadowType === "outline") {
        shadow = `${shadowColor} 0px 0px 2px, ${shadowColor} 0px 0px 2px, ${shadowColor} 0px 0px 2px, ${shadowColor} 0px 0px 2px, ${shadowColor} 0px 0px 2px`;
    }

    if (fontFamily.includes('Marcellus')) {
        extraStyle = 'font-variant: small-caps;';
    }

    return `
        .ytp-caption-segment {
            background: ${backgroundColor} !important;
            color: ${fontColor} !important;
            text-shadow: ${shadow} !important;
            font-family: ${fontFamily} !important;
            ${extraStyle}
        }
    `;
}

function updatePreview() {
    const background = document.querySelector("#background").getAttribute("value");
    const colour = document.querySelector("#colour").getAttribute("value");
    const shadowType = document.querySelector("#shadow-type").value;
    const shadowColour = document.querySelector("#shadow-colour").getAttribute("value");
    const fontFamily = document.querySelector("#font-family").value;

    let shadow;
    if (shadowType === "none") {
        shadow = "none";
    } else if (shadowType === "drop-shadow") {
        shadow = `${shadowColour} 1px 1px 2px`;
    } else if (shadowType === "outline") {
        shadow = `${shadowColour} 0px 0px 2px, ${shadowColour} 0px 0px 2px, ${shadowColour} 0px 0px 2px, ${shadowColour} 0px 0px 2px, ${shadowColour} 0px 0px 2px`;
    }

    document.querySelectorAll(".ytp-caption-segment").forEach((segment) => {
        segment.style.background = background;
        segment.style.color = colour;
        segment.style.fill = colour;
        segment.style.textShadow = shadow;
        segment.style.fontFamily = fontFamily;
    });
}

async function restoreOptions() {
    const res = await browser.storage.sync.get([
        "background",
        "colour",
        "shadowType",
        "shadowColour",
        "fontFamily",
        "centerCaptions"
    ]);
    
    document.querySelector("#background").setAttribute("value", res.background || "rgba(8, 8, 8, 0.75)");
    document.querySelector("#colour").setAttribute("value", res.colour || "rgba(255, 255, 255, 1)");
    document.querySelector("#shadow-type").value = res.shadowType || "none";
    document.querySelector("#shadow-colour").setAttribute("value", res.shadowColour || "rgba(8, 8, 8, 1)");
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
document.getElementById("colour").addEventListener("input", updatePreview);
document.getElementById("shadow-type").addEventListener("input", updatePreview);
document.getElementById("shadow-colour").addEventListener("input", updatePreview);
document.getElementById("font-family").addEventListener("input", updatePreview);

function applyPreset1() {
    document.querySelector("#background").setAttribute("value", "rgba(255, 255, 255, 0.25)");
    document.querySelector("#colour").setAttribute("value", "rgba(0, 255, 0, 1)");
    document.querySelector("#shadow-type").value = "drop-shadow";
    document.querySelector("#shadow-colour").setAttribute("value", "rgba(34, 34, 34, 1)");
    document.querySelector("#font-family").value = "Dancing Script, cursive";
    updatePreview();
}

function applyPreset2() {
    document.querySelector("#background").setAttribute("value", "rgba(255, 255, 255, 0)");
    document.querySelector("#colour").setAttribute("value", "rgba(243, 203, 80, 1)");
    document.querySelector("#shadow-type").value = "drop-shadow";
    document.querySelector("#shadow-colour").setAttribute("value", "rgba(0, 0, 0, 0.94)");
    document.querySelector("#font-family").value = "Georgia, serif";
    updatePreview();
}

function applyPreset3() {
    document.querySelector("#background").setAttribute("value", "rgba(8, 8, 8, 0.75)");
    document.querySelector("#colour").setAttribute("value", "rgba(255, 255, 255, 1)");
    document.querySelector("#shadow-type").value = "none";
    document.querySelector("#shadow-colour").setAttribute("value", "rgba(8, 8, 8, 1)");
    document.querySelector("#font-family").value = "YouTube Noto, Roboto, Arial, Helvetica, Verdana, PT Sans Caption, sans-serif";
    updatePreview();
}

document.querySelectorAll('colour-picker').forEach(picker => {
    picker.addEventListener('change', (event) => {
        updatePreview();
    });
});