const clippyContainer = document.getElementById("clippy-container")

async function fetchClippyHTML() {
    const clippyDataHTML = await fetch("../clippy.html")
    return clippyDataHTML.text()
}

async function fetchClippyCSS() {
    const clippyDataBootstrap = await fetch("../css/thirdparty/bootstrap.min.css")
    const clippyDataCSS = await fetch("../css/clippy.css")
    const clippyData = (await clippyDataBootstrap.text()) + (await clippyDataCSS.text())
    return clippyData
}

async function addClippyHTML() {
    //clippyContainer.attachShadow({ mode: "open" })
    //const clippyCSS = new CSSStyleSheet()
    //clippyCSS.replaceSync(await fetchClippyCSS())
    //clippyContainer.shadowRoot.adoptedStyleSheets.push(clippyCSS)
    //const clippyHTML = await fetchClippyHTML()
    // This is absolutely fucking awful.
    //clippyContainer.insertAdjacentHTML("afterbegin", clippyHTML)
}

window.addEventListener("load", () => {
    addClippyHTML()
})