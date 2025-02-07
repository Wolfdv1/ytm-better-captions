/**
 * Save the options selected by the user.
 * @param {Event} event - The event triggered by the form submission.
 */
async function saveOptions(event) {
    event.preventDefault();
    const options = {
        background: document.querySelector("#background").getAttribute("value"),
        colour: document.querySelector("#colour").getAttribute("value"),
        shadowType: document.querySelector("#shadow-type").value,
        shadowColour: document.querySelector("#shadow-colour").getAttribute("value"),
        fontFamily: document.querySelector("#font-family").value,
        centerCaptions: document.querySelector("#center-captions").checked,
        fontScale: document.querySelector("#font-scale").value
    };
    const cssString = generateCSS(options);
    await browser.storage.sync.set({ cssString, ...options });
    browser.runtime.sendMessage({
        message: "optionsChanged",
        cssString: cssString
    });

    // Display confirmation message
    const saveButton = document.querySelector("button[type='submit']");
    saveButton.textContent = "Saved and Applied!";
    saveButton.classList.add("saved"); // Add a class for styling

    // Revert the button text after a short delay
    setTimeout(() => {
        saveButton.textContent = "Save";
        saveButton.classList.remove("saved");
    }, 2000); // Revert after 2 seconds
}

/**
 * Generate the CSS string based on the options provided.
 * @param {Object} options - The options selected by the user.
 * @returns {string} The generated CSS string.
 */
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

    // Add small-caps style for both original YouTube option and Marcellus
    if (fontFamily.includes('Marcellus') || 
        (fontFamily.includes('Arial') && fontFamily.includes('Verdana'))) {
        extraStyle = 'font-variant: small-caps;';
    }

    const fontScale = options.fontScale || 1;

    let centerStyle = '';
    if (options.centerCaptions) {
        centerStyle = `
        .caption-window {
            width: 95% !important;
            left: 2.5% !important;
            margin-left: 0% !important;
            border-left-width: 0% !important;
        }
        .ytp-caption-window-container {
            width: 100% !important;
        }`;
    }

    return `
        .ytp-caption-segment {
            background: ${backgroundColor} !important;
            color: ${fontColor} !important;
            text-shadow: ${shadow} !important;
            font-family: ${fontFamily} !important;
            font-size: max(abs(calc((1vw - 2vh) * ${fontScale} )), abs(calc((3vw - 2vh) * ${fontScale} ))) !important;
            --font-size: max(abs(calc((1vw - 2vh) * ${fontScale} )), abs(calc((3vw - 2vh) * ${fontScale} ))) !important;
            ${extraStyle}
        }
        ${centerStyle}
    `;
}

/**
 * Update the preview of the captions based on the current options.
 */
function updatePreview() {
    const background = document.querySelector("#background").getAttribute("value");
    const colour = document.querySelector("#colour").getAttribute("value");
    const shadowType = document.querySelector("#shadow-type").value;
    const shadowColour = document.querySelector("#shadow-colour").getAttribute("value");
    const fontFamily = document.querySelector("#font-family").value;
    const fontScale = parseFloat(document.querySelector("#font-scale").value);

    let shadow;
    if (shadowType === "none") {
        shadow = "none";
    } else if (shadowType === "raised") {
        shadow = `${shadowColour} 1px 1px 0px, ${shadowColour} 2px 2px 0px, ${shadowColour} 3px 3px 0px`;
    } else if (shadowType === "drop-shadow") {
        shadow = `${shadowColour} 2px 2px 3px, ${shadowColour} 2px 2px 4px, ${shadowColour} 2px 2px 5px`;
    } else if (shadowType === "depressed") {
        shadow = `${shadowColour} 1px 1px 0px, ${shadowColour} -1px -1px 0px`;
    } else if (shadowType === "outline") {
        shadow = `${shadowColour} 0px 0px 2px, ${shadowColour} 0px 0px 2px, ${shadowColour} 0px 0px 2px, ${shadowColour} 0px 0px 2px, ${shadowColour} 0px 0px 2px`;
    }

    const centerCaptions = document.querySelector("#center-captions").checked;
    const captionWindow = document.querySelector(".ytp-caption-window");
    const container = document.querySelector(".ytp-caption-window-container");

    if (centerCaptions) {
        container.style.textAlign = "center";
        captionWindow.style.position = "relative";
        captionWindow.style.left = "auto";
        captionWindow.style.width = "100%";
        captionWindow.style.display = "flex";
        captionWindow.style.flexDirection = "column";
        captionWindow.style.alignItems = "center";
        
        document.querySelectorAll(".caption-visual-line").forEach(line => {
            line.style.textAlign = "center";
            line.style.width = "100%";
        });
    } else {
        container.style.textAlign = "left";
        captionWindow.style.position = "absolute";
        captionWindow.style.left = "";
        captionWindow.style.width = "";
        captionWindow.style.display = "";
        captionWindow.style.flexDirection = "";
        captionWindow.style.alignItems = "";
        
        document.querySelectorAll(".caption-visual-line").forEach(line => {
            line.style.textAlign = "";
            line.style.width = "";
        });
    }

    document.querySelectorAll(".ytp-caption-segment").forEach((segment) => {
        segment.style.background = background;
        segment.style.color = colour;
        segment.style.fill = colour;
        segment.style.textShadow = shadow;
        segment.style.fontFamily = fontFamily;
        segment.style.fontSize = `max(abs(calc((1vw - 2vh) * ${fontScale})), abs(calc((3vw - 2vh) * ${fontScale})))`;
    });
}

/**
 * Restore the options from the browser storage.
 */
async function restoreOptions() {
    const res = await browser.storage.sync.get([
        "background",
        "colour",
        "shadowType",
        "shadowColour",
        "fontFamily",
        "centerCaptions",
        "fontScale"
    ]);
    
    document.querySelector("#background").setAttribute("value", res.background || "rgba(8, 8, 8, 0.75)");
    document.querySelector("#colour").setAttribute("value", res.colour || "rgba(255, 255, 255, 1)");
    document.querySelector("#shadow-type").value = res.shadowType || "none";
    document.querySelector("#shadow-colour").setAttribute("value", res.shadowColour || "rgba(8, 8, 8, 1)");
    document.querySelector("#font-family").value = res.fontFamily || "YouTube Noto, Roboto, Arial, Helvetica, Verdana, PT Sans Caption, sans-serif";
    document.querySelector("#center-captions").checked = res.centerCaptions || false;
    document.querySelector("#font-scale").value = res.fontScale || 1;
    updatePreview();
}

// Event listeners for DOM content loaded and form submission
document.addEventListener("DOMContentLoaded", () => {
    // Add fonts loaded check before showing select
    const fontSelect = document.querySelector("#font-family");
    document.fonts.ready.then(() => {
        fontSelect.classList.add('fonts-loaded');
    });
    restoreOptions();
});
window.addEventListener("load", updatePreview); // Add this line
document.querySelector("form").addEventListener("submit", saveOptions);

// Event listeners for preset buttons
document.getElementById("preset1").addEventListener("click", applyPreset1);
document.getElementById("preset2").addEventListener("click", applyPreset2);
document.getElementById("preset3").addEventListener("click", applyPreset3);
document.getElementById("preset4").addEventListener("click", applyPreset4); // Add this line

// Event listeners for input changes
document.getElementById("background").addEventListener("input", updatePreview);
document.getElementById("colour").addEventListener("input", updatePreview);
document.getElementById("shadow-type").addEventListener("input", updatePreview);
document.getElementById("shadow-colour").addEventListener("input", updatePreview);
document.getElementById("font-family").addEventListener("input", updatePreview);
document.getElementById("font-scale").addEventListener("input", updatePreview);
document.getElementById("center-captions").addEventListener("change", updatePreview);

/**
 * Apply the first preset.
 */
function applyPreset1() {
    document.querySelector("#background").setAttribute("value", "rgba(95, 0, 114, 0.85)");
    document.querySelector("#colour").setAttribute("value", "rgba(255, 174, 0, 0.95)");
    document.querySelector("#shadow-type").value = "outline";
    document.querySelector("#shadow-colour").setAttribute("value", "rgba(0, 0, 0, 1)");
    document.querySelector("#font-family").value = '"Press Start 2P", monospace';
    document.querySelector("#font-scale").value = 1.1;
    updatePreview();
}

/**
 * Apply the second preset.
 */
function applyPreset2() {
    document.querySelector("#background").setAttribute("value", "rgba(255, 255, 255, 0)");
    document.querySelector("#colour").setAttribute("value", "rgba(255, 255, 255, 1)");
    document.querySelector("#shadow-type").value = "drop-shadow";
    document.querySelector("#shadow-colour").setAttribute("value", "rgba(0, 0, 0, 0.9)");
    document.querySelector("#font-family").value = '"Dancing Script", "Monotype Corsiva", "URW Chancery L", "Apple Chancery", cursive';
    document.querySelector("#font-scale").value = 1.4;
    updatePreview();
}

/**
 * Apply the third preset.
 */
function applyPreset3() {
    document.querySelector("#background").setAttribute("value", "rgba(255, 255, 255, 0)");
    document.querySelector("#colour").setAttribute("value", "rgba(243, 203, 80, 1)");
    document.querySelector("#shadow-type").value = "raised";
    document.querySelector("#shadow-colour").setAttribute("value", "rgba(0, 0, 0, 1)");
    document.querySelector("#font-family").value = '"Permanent Marker", Impact, sans-serif';
    document.querySelector("#font-scale").value = 1.2;
    updatePreview();
}

/**
 * Apply the fourth preset.
 */
function applyPreset4() {
    document.querySelector("#background").setAttribute("value", "rgba(8, 8, 8, 0.75)");
    document.querySelector("#colour").setAttribute("value", "rgba(255, 255, 255, 1)");
    document.querySelector("#shadow-type").value = "none";
    document.querySelector("#shadow-colour").setAttribute("value", "rgba(8, 8, 8, 1)");
    document.querySelector("#font-family").value = '"YouTube Noto", Roboto, Arial, Helvetica, Verdana, "PT Sans Caption", sans-serif';
    document.querySelector("#font-scale").value = 1;
    updatePreview();
}

// Event listeners for colour picker changes
document.querySelectorAll('colour-picker').forEach(picker => {
    picker.addEventListener('change', (event) => {
        updatePreview();
    });
});