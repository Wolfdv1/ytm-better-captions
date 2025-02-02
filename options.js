async function saveOptions(event) {
    event.preventDefault();
    const options = {
        background: document.querySelector("#background").value,
        fontSize: document.querySelector("#font-size").value,
        colour: document.querySelector("#colour").value,
        shadowType: document.querySelector("#shadow-type").value,
        shadowColour: document.querySelector("#shadow-colour").value,
        fontFamily: document.querySelector("#font-family").value,
    };
    await browser.storage.sync.set(options);
    browser.runtime.sendMessage({
        message: "optionsChanged",
        options: options,
    });
}

async function restoreOptions() {
    const res = await browser.storage.sync.get([
        "background",
        "fontSize",
        "colour",
        "shadowType",
        "shadowColour",
        "fontFamily",
    ]);
    document.querySelector("#background").value = res.background || "#080808";
    document.querySelector("#font-size").value = res.fontSize || "32";
    document.querySelector("#colour").value = res.colour || "#ffffff";
    document.querySelector("#shadow-type").value = res.shadowType || "none";
    document.querySelector("#shadow-colour").value = res.shadowColour || "#080808";
    document.querySelector("#font-family").value = res.fontFamily || "YouTube Noto, Roboto, Arial, Helvetica, Verdana, PT Sans Caption, sans-serif";
    updatePreview();
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);

document.getElementById("preset1").addEventListener("click", applyPreset1);
document.getElementById("preset2").addEventListener("click", applyPreset2);

document.getElementById("background").addEventListener("input", updatePreview);
document.getElementById("font-size").addEventListener("input", updatePreview);
document.getElementById("colour").addEventListener("input", updatePreview);
document.getElementById("shadow-type").addEventListener("input", updatePreview);
document.getElementById("shadow-colour").addEventListener("input", updatePreview);
document.getElementById("font-family").addEventListener("input", updatePreview);

function applyPreset1() {
    document.getElementById("background").value = "#ffffff";
    document.getElementById("font-size").value = "23.9556";
    document.getElementById("colour").value = "#00ff00";
    document.getElementById("shadow-type").value = "drop-shadow";
    document.getElementById("shadow-colour").value = "#222222";
    document.getElementById("font-family").value = "Monotype Corsiva, URW Chancery L, Apple Chancery, Dancing Script, cursive";
    updatePreview();
}

function applyPreset2() {
    document.getElementById("background").value = "#080808";
    document.getElementById("font-size").value = "14.0889";
    document.getElementById("colour").value = "#fefefe";
    document.getElementById("shadow-type").value = "drop-shadow";
    document.getElementById("shadow-colour").value = "#000000";
    document.getElementById("font-family").value = "YouTube Noto, Roboto, Arial, Helvetica, Verdana, PT Sans Caption, sans-serif";
    updatePreview();
}

function updatePreview() {
    const background = document.getElementById("background").value;
    const fontSize = document.getElementById("font-size").value + "px";
    const colour = document.getElementById("colour").value;
    const shadowType = document.getElementById("shadow-type").value;
    const shadowColour = document.getElementById("shadow-colour").value;
    const fontFamily = document.getElementById("font-family").value;

    const shadow = shadowType === "none" ? "none" : `${shadowColour} 1px 1px 2px`;

    document.querySelectorAll(".ytp-caption-segment").forEach((segment) => {
        segment.style.background = background;
        segment.style.fontSize = fontSize;
        segment.style.color = colour;
        segment.style.fill = colour;
        segment.style.textShadow = shadow;
        segment.style.fontFamily = fontFamily;
    });
}