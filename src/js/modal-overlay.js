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
    secretSettingsButtonSave.disabled = "true"
    secretSettingsButtonClose.disabled = "true"
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

passcodeModal.addEventListener("hide.bs.modal", () => {
    passcodeClear()
    passcodeVerifyError(false)
})

passcodeModal.addEventListener("hidden.bs.modal", () => {
    if (!openingSecretSettings) {
        window.parent.hideModalOverlay()
    }
    window.openingSecretSettings = false
    Array.from(window.parent.document.getElementsByClassName("iconContainer")).forEach(element => {
        element.removeAttribute("tabindex")
    })
})

secretSettingsModal.addEventListener("hidden.bs.modal", () => {
    window.parent.hideModalOverlay()
    Array.from(window.parent.document.getElementsByClassName("iconContainer")).forEach(element => {
        element.removeAttribute("tabindex")
    })
})

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