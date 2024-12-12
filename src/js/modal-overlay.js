const passcodeModal = document.getElementById("passcode-modal")
const passcodeModalVerify = document.getElementById("passcode-modal-verify")
const passcodeModalInput = document.getElementById("passcode-modal-input")
const passcodeModalInputClear = document.getElementById("passcode-modal-input-clear")
const passcodeModalSettingsClear = document.getElementById("passcode-modal-settings-clear")
const passcodeModalBS = new bootstrap.Modal("#passcode-modal")
// Modified from https://getbootstrap.com/docs/5.3/components/alerts/#live-example
const passcodeModalAlert = document.getElementById("passcode-modal-alert")
function createPasscodeModalAlert() {
  const passcodeModalAlertWrapper = document.createElement("div")
  passcodeModalAlertWrapper.innerHTML = [
    '<div class="alert alert-danger alert-dismissible" role="alert">',
    '    <h4 class="alert-heading"><i class="bi bi-exclamation-triangle"></i> Incorrect passcode</h4>',
    '    <p>You can try entering the passcode again.</p>',
    '    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    '</div>'
  ].join("")

  passcodeModalAlert.append(passcodeModalAlertWrapper)
}
const secretSettingsModal = document.getElementById("secret-settings-modal")
const secretSettingsButtonSave = document.getElementById("secret-settings-button-save")
const secretSettingsButtonClose = document.getElementById("secret-settings-button-close")
const secretSettingsModalBS = new bootstrap.Modal("#secret-settings-modal")
var openingSecretSettings = false

const fontSelection = document.getElementById("font-selection")
const backgroundSelection = document.getElementById("background-selection")
const gradientSelection = document.getElementById("gradient-selection")
const gradientSelectionReset = document.getElementById("gradient-selection-reset")
const fontPreview = document.getElementById("font-preview")
const backgroundPreview = document.getElementById("background-preview")
const backgroundPreviewNotes = document.getElementById("background-preview-notes")

const controllerButtonA = document.getElementById("controller-button-a")
const controllerButtonB = document.getElementById("controller-button-b")
const controllerButtonStart = document.getElementById("controller-button-start")
const controllerButtonSelect = document.getElementById("controller-button-select")
const controllerButtonUp = document.getElementById("controller-button-up")
const controllerButtonRight = document.getElementById("controller-button-right")
const controllerButtonDown = document.getElementById("controller-button-down")
const controllerButtonLeft = document.getElementById("controller-button-left")

function passcodeVerifyError(visible) {
    if (visible) {
        createPasscodeModalAlert()
    } else {
        document.getElementById("passcode-modal-alert").innerHTML = ""
    }
}

function passcodeAppendValue(value) {
    if (passcodeModalInput.value.length < 11) {
        passcodeModalInput.value += value
    } else {
        throw Error("Passcode too long.")
    }
}

function passcodeVerify() {
    if (passcodeModalInput.value === "\uF147\uF147\uF126\uF126\uF12E\uF137\uF12E\uF137BA\uF4F5") { // This is so stupid. At least it's better than raw Unicode characters.
        passcodeVerifyError(false)
        openSecretSettingsModal()
    } else {
        passcodeVerifyError(false)
        passcodeVerifyError(true)
    }
    passcodeClear()
    
}

function passcodeClear() {
    passcodeModalInput.value = ""
}

function openPasscodeModal() {
    Array.from(window.parent.document.getElementsByClassName("iconContainer")).forEach(element => {
        element.tabIndex = "-1"
    })
    passcodeModalBS.show()
}


function openSecretSettingsModal() {
    window.openingSecretSettings = true
    passcodeModalBS.hide()
    secretSettingsModalBS.show()
}

function getSeasonalBackground(month) {
    month += 1
    if (month == 12 || month <= 2) {
        // WINTER
        return "./img/fall_winter.webp"
    } else if (month >= 3 && month <= 5) {
        // SPRING
        return "./img/spring_summer.webp"
    } else if (month >= 6 && month <= 9) {
        // SUMMER
        return "./img/spring_summer.webp"
    } else {
        // FALL
        return "./img/fall_winter.webp"
    }
}

// Using onclick listeners in the HTML causes CSP violations. I actually fixed the issue without a hack. You can thank me :)
controllerButtonA.addEventListener("click", () => {
    passcodeAppendValue("A")
})

controllerButtonB.addEventListener("click", () => {
    passcodeAppendValue("B")
})

controllerButtonStart.addEventListener("click", () => {
    passcodeAppendValue("\uF4F5")
})

controllerButtonSelect.addEventListener("click", () => {
    passcodeAppendValue("\uF4F5")
})

controllerButtonUp.addEventListener("click", () => {
    passcodeAppendValue("\uF147")
})

controllerButtonRight.addEventListener("click", () => {
    passcodeAppendValue("\uF137")
})

controllerButtonDown.addEventListener("click", () => {
    passcodeAppendValue("\uF126")
})

controllerButtonLeft.addEventListener("click", () => {
    passcodeAppendValue("\uF12E")
})

passcodeModalVerify.addEventListener("click", () => {
    passcodeVerify()
})

passcodeModalInputClear.addEventListener("click", () => {
    passcodeClear()
})

secretSettingsButtonSave.addEventListener("click", () => {
    saveSecretSettings()
    window.parent.location.reload()
})

passcodeModal.addEventListener("show.bs.modal", () => {
    passcodeVerifyError(false)
})

passcodeModal.addEventListener("shown.bs.modal", () => {
    passcodeVerifyError(false)
    console.log("resizing image map...")
    imageMapResize()
})

passcodeModal.addEventListener("hidden.bs.modal", () => {
    passcodeClear()
    passcodeVerifyError(false)
    if (!openingSecretSettings) {
        window.parent.hideModalOverlay()
        Array.from(window.parent.document.getElementsByClassName("iconContainer")).forEach(element => {
            element.removeAttribute("tabindex")
        })
    }
    window.openingSecretSettings = false
})

passcodeModalSettingsClear.addEventListener("click", () => {
    clearSecretSettings()
    window.parent.location.reload()
})

secretSettingsModal.addEventListener("show.bs.modal", () => {
    loadSecretSettings()
    updateBackgroundPreview()
    updateFontPreview()
    backgroundPreview.hidden = false
    backgroundPreviewNotes.hidden = false
})

secretSettingsModal.addEventListener("hide.bs.modal", () => {
    Array.from(window.parent.document.getElementsByClassName("iconContainer")).forEach(element => {
        element.removeAttribute("tabindex")
    })
})

secretSettingsModal.addEventListener("hidden.bs.modal", () => {
    window.parent.hideModalOverlay()
    fontSelection.value = "azeret-mono"
    backgroundSelection.value = "seasonal"
    gradientSelection.value = "#9b042a"
})

gradientSelectionReset.addEventListener("click", () => {
    gradientSelection.value = "#9b042a"
})

backgroundSelection.addEventListener("change", () => {
    backgroundPreview.hidden = false
    backgroundPreviewNotes.hidden = false
    updateBackgroundPreview()
})

fontSelection.addEventListener("change", () => {
    updateFontPreview()
})

function updateBackgroundPreview() {
    switch (backgroundSelection.value) {
        case "seasonal":
            backgroundPreview.setAttribute("src", getSeasonalBackground((new Date()).getMonth))
            backgroundPreviewNotes.innerHTML = "This background will change automatically based on the seasons. There are only two images we can use, so a given image is actually used for two seasons."
            break
        case "bliss":
            backgroundPreview.setAttribute("src", "./img/secret/bliss_windows_xp.webp")
            backgroundPreviewNotes.innerHTML = "I added this in because nostalgia."
            break
        case "msc-building":
            backgroundPreview.setAttribute("src", "./img/spring_summer.webp")
            backgroundPreviewNotes.innerHTML = "This background was brought over from the older version of the extension. There is no higher quality version because I couldn't get AI upscaling to get usable results."
            break
        case "snow":
            backgroundPreview.setAttribute("src", "./img/fall_winter.webp")
            backgroundPreviewNotes.innerHTML = "This background was introduced in version 3.0. It's also AI upscaled, but you can also use the original, low quality version instead if you want."
            break
        case "snow-low-quality":
            backgroundPreview.setAttribute("src", "./img/secret/snow_low_quality.webp")
            backgroundPreviewNotes.innerHTML = "This background was introduced in version 3.0. This version of the image was shared on the Programming Club Discord server and is included as-is."
            break
        case "original-fall-winter":
            backgroundPreview.setAttribute("src", "./img/secret/original_fall_winter.webp")
            backgroundPreviewNotes.innerHTML = "Although this background was in the older version of the extension, you never actually saw it because the seasonal background feature wasn't functional at the time."
            break
        case "street-view":
            backgroundPreview.setAttribute("src", "./img/secret/street_view.webp")
            backgroundPreviewNotes.innerHTML = "This is a Google Street View screenshot, dating back to 2012. This version of the background was shared on the Programming Club Discord server and is included as-is.<br>Image attribution: &copy; 2024 Google"
            break
        case "street-view-better":
            backgroundPreview.setAttribute("src", "./img/secret/street_view_better.webp")
            backgroundPreviewNotes.innerHTML = "This is a Google Street View screenshot, dating back to 2012. This background has a greater field of view and resolution, compared to the other version.<br>Image attribution: &copy; 2024 Google"
            break
        default:
            backgroundPreview.hidden = true
            backgroundPreviewNotes.hidden = true
    }
}

function updateFontPreview() {
    switch (fontSelection.value) {
        case "azeret-mono":
            fontPreview.style.setProperty("font-family", "Azeret Mono, monospace", "important")
            break
        case "sans-serif":
            fontPreview.style.setProperty("font-family", "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif", "important")
            break
        case "inter":
            fontPreview.style.setProperty("font-family", "Inter, sans-serif", "important")
            break
        case "lato":
            fontPreview.style.setProperty("font-family", "Lato, sans-serif", "important")
            break
        case "montserrat":
            fontPreview.style.setProperty("font-family", "Montserrat, sans-serif", "important")
            break
        case "nunito":
            fontPreview.style.setProperty("font-family", "Nunito, sans-serif", "important")
            break
        case "poppins":
            fontPreview.style.setProperty("font-family", "Poppins, sans-serif", "important")
            break
        case "raleway":
            fontPreview.style.setProperty("font-family", "Raleway, sans-serif", "important")
            break
        case "rubik":
            fontPreview.style.setProperty("font-family", "Rubik, sans-serif", "important")
            break
        default:
            fontPreview.style.setProperty("font-family", "Azeret Mono, monospace", "important")
    }
}

function loadSecretSettings() {
    switch (localStorage.getItem("secretSettings_fontSelection")) {
        case "azeret-mono":
            fontSelection.value = "azeret-mono"
            break
        case "sans-serif":
            fontSelection.value = "sans-serif"
            break
        case "inter":
            fontSelection.value = "inter"
            break
        case "lato":
            fontSelection.value = "lato"
            break
        case "montserrat":
            fontSelection.value = "montserrat"
            break
        case "nunito":
            fontSelection.value = "nunito"
            break
        case "poppins":
            fontSelection.value = "poppins"
            break
        case "raleway":
            fontSelection.value = "raleway"
            break
        case "rubik":
            fontSelection.value = "rubik"
            break
        default:
            localStorage.removeItem("secretSettings_fontSelection")
    }

    switch (localStorage.getItem("secretSettings_backgroundSelection")) {
        case "seasonal":
            backgroundSelection.value = "seasonal"
            break
        case "bliss":
            backgroundSelection.value = "bliss"
            break
        case "msc-building":
            backgroundSelection.value = "msc-building"
            break
        case "snow":
            backgroundSelection.value = "snow"
            break
        case "snow-low-quality":
            backgroundSelection.value = "snow-low-quality"
            break
        case "original-fall-winter":
            backgroundSelection.value = "original-fall-winter"
            break
        case "street-view":
            backgroundSelection.value = "street-view"
            break
        case "street-view-better":
            backgroundSelection.value = "street-view-better"
            break
        default:
            localStorage.removeItem("secretSettings_backgroundSelection")
    }

    if (/^#[0-9A-F]{6}$/i.test(localStorage.getItem("secretSettings_gradientSelection"))) {
        gradientSelection.value = localStorage.getItem("secretSettings_gradientSelection")
    } else {
        localStorage.removeItem("secretSettings_gradientSelection")
    }

    secretSettingsButtonSave.disabled = false
    secretSettingsButtonClose.disabled = false
    fontSelection.disabled = false
    backgroundSelection.disabled = false
    gradientSelection.disabled = false
    gradientSelectionReset.disabled = false
}

function saveSecretSettings() {
    secretSettingsButtonSave.disabled = true
    secretSettingsButtonClose.disabled = true
    fontSelection.disabled = true
    backgroundSelection.disabled = true
    gradientSelection.disabled = true
    gradientSelectionReset.disabled = true

    switch (fontSelection.value) {
        case "azeret-mono":
            localStorage.setItem("secretSettings_fontSelection", "azeret-mono")
            break
        case "sans-serif":
            localStorage.setItem("secretSettings_fontSelection", "sans-serif")
            break
        case "inter":
            localStorage.setItem("secretSettings_fontSelection", "inter")
            break
        case "lato":
            localStorage.setItem("secretSettings_fontSelection", "lato")
            break
        case "montserrat":
            localStorage.setItem("secretSettings_fontSelection", "montserrat")
            break
        case "nunito":
            localStorage.setItem("secretSettings_fontSelection", "nunito")
            break
        case "poppins":
            localStorage.setItem("secretSettings_fontSelection", "poppins")
            break
        case "raleway":
            localStorage.setItem("secretSettings_fontSelection", "raleway")
            break
        case "rubik":
            localStorage.setItem("secretSettings_fontSelection", "rubik")
            break
        default:
            throw Error(`Unknown value for fontSelection: ${fontSelection.value}`)
    }

    switch (backgroundSelection.value) {
        case "seasonal":
            localStorage.setItem("secretSettings_backgroundSelection", "seasonal")
            break
        case "bliss":
            localStorage.setItem("secretSettings_backgroundSelection", "bliss")
            break
        case "msc-building":
            localStorage.setItem("secretSettings_backgroundSelection", "msc-building")
            break
        case "snow":
            localStorage.setItem("secretSettings_backgroundSelection", "snow")
            break
        case "snow-low-quality":
            localStorage.setItem("secretSettings_backgroundSelection", "snow-low-quality")
            break
        case "original-fall-winter":
            localStorage.setItem("secretSettings_backgroundSelection", "original-fall-winter")
            break
        case "street-view":
            localStorage.setItem("secretSettings_backgroundSelection", "street-view")
            break
        case "street-view-better":
            localStorage.setItem("secretSettings_backgroundSelection", "street-view-better")
            break
        default:
            throw Error(`Unknown value for backgroundSelection: ${backgroundSelection.value}`)
    }

    if (/^#[0-9A-F]{6}$/i.test(gradientSelection.value)) {
        localStorage.setItem("secretSettings_gradientSelection", gradientSelection.value)
    } else {
        throw Error(`Not a valid hex color code: ${gradientSelection.value}`)
    }
}

function clearSecretSettings() {
    localStorage.removeItem("secretSettings_fontSelection")
    localStorage.removeItem("secretSettings_backgroundSelection")
    localStorage.removeItem("secretSettings_gradientSelection")
}

function sanityCheck() {
    // This is used by newtab.js to check if the modal overlay is actually loaded, to avoid issues when the modal overlay page isn't loaded for some reason.
    return true
}

// Hide the modal overlay when the iframe loads to avoid certain edge case issues (right click -> reload frame).
// This also checks for the "file:" URL scheme and if the user opens the page outside of an iframe, and displays a message for each.
if (self === top) {
    document.body.innerHTML = "<h3>This page is intended to be embedded into the new tab page.</h3><p>You can safely navigate away or close this page.</p>"
} else {
    try {
        // This will emit an error if cross-origin restrictions are causing issues.
        window.parent.hideModalOverlay()
    } catch {
        alert("CORS permission check failed.\nIf you are using the \"file:\" URL scheme, please run this extension by enabling developer mode in Chrome and loading this extension unpacked.")
    }
}