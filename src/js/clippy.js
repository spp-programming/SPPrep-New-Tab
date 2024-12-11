const clippyToast = document.getElementById("clippy-toast")
const clippyToastBS = bootstrap.Toast.getOrCreateInstance(clippyToast)
const clippyMessage = document.getElementById("clippy-message")
const clippyImage = document.getElementById("clippy-image")
const buttonYes = document.getElementById("button-yes")
const buttonNo = document.getElementById("button-no")
const buttonBack = document.getElementById("button-back")
const buttonExit = document.getElementById("button-exit")
const buttonNavigation = document.getElementById("button-navigation")
const buttonSecret = document.getElementById("button-secret")
const buttonOther = document.getElementById("button-other")

function mainMenu() {
    buttonYes.disabled = true
    buttonNo.disabled = true
    buttonYes.hidden = true
    buttonNo.hidden = true
    clippyMessage.innerText = "What can I help you with today?"
    buttonNavigation.hidden = false
    buttonSecret.hidden = false
    buttonOther.hidden = false
    buttonNavigation.disabled = false
    buttonSecret.disabled = false
    buttonOther.disabled = false
    buttonExit.innerText = "Nothing."
    buttonExit.disabled = false
    buttonExit.hidden = false
}

buttonYes.addEventListener("click", () => {
    mainMenu()
})

buttonNo.addEventListener("click", () => {
    buttonYes.disabled = true
    buttonNo.disabled = true
    clippyToastBS.hide()
})

buttonExit.addEventListener("click", () => {
    buttonNavigation.disabled = true
    buttonSecret.disabled = true
    buttonOther.disabled = true
    clippyToastBS.hide()
})

buttonBack.addEventListener("click", () => {
    buttonBack.disabled = true
    buttonBack.hidden = true
    clippyImage.setAttribute("src", "img/res/clippy/clippy.png")
    mainMenu()
})

buttonSecret.addEventListener("click", () => {
    clippyMessage.innerHTML = "That's a secret.<br>I am contractually obligated not to give you further details on this topic."
    clippyImage.setAttribute("src", "img/res/clippy/clippy_busy.png")
    buttonNavigation.disabled = true
    buttonSecret.disabled = true
    buttonOther.disabled = true
    buttonExit.disabled = true
    buttonNavigation.hidden = true
    buttonSecret.hidden = true
    buttonOther.hidden = true
    buttonExit.hidden = true
    buttonBack.disabled = false
    buttonBack.hidden = false
})

buttonOther.addEventListener("click", () => {
    clippyMessage.innerHTML = "Too bad!<br>Those are the only things I actually know about."
    clippyImage.setAttribute("src", "img/res/clippy/clippy_annoyed.png")
    buttonNavigation.disabled = true
    buttonSecret.disabled = true
    buttonOther.disabled = true
    buttonExit.disabled = true
    buttonNavigation.hidden = true
    buttonSecret.hidden = true
    buttonOther.hidden = true
    buttonExit.hidden = true
    buttonBack.disabled = false
    buttonBack.hidden = false
})

buttonNavigation.addEventListener("click", () => {
    clippyMessage.innerHTML = "To navigate SPP New Tab, you can click on its corresponding button.<br>Try it!"
    clippyImage.setAttribute("src", "img/res/clippy/clippy_alt.png")
    buttonNavigation.disabled = true
    buttonSecret.disabled = true
    buttonOther.disabled = true
    buttonExit.disabled = true
    buttonNavigation.hidden = true
    buttonSecret.hidden = true
    buttonOther.hidden = true
    buttonExit.hidden = true
    buttonBack.disabled = false
    buttonBack.hidden = false
})

window.addEventListener("load", () => {
    clippyToastBS.show()
})