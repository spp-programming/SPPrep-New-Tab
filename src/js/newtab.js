const primaryTimeZone = "America/New_York"
const currentTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
const calendarManager = (() => {
    const API_KEY = "AIzaSyCOQ3EYDqe7-ypGvnNb1NZQN6Ib2eb7LG0"
    const CALENDAR_ID = "144grand@gmail.com"
    const CALENDAR_TZ = primaryTimeZone

    // Get the current date in UTC
    const currentDateUTC = new Date()

    // Get the time zone offset in minutes for the current date
    const timeZoneOffsetMinutes = getTimeZoneOffsetFromName(CALENDAR_TZ)

    // Convert the current date to EST by adjusting according to timezone offset
    const timeZoneOffset = -timeZoneOffsetMinutes // EST offset in minutes
    const currentDateEST = new Date(currentDateUTC.getTime() + timeZoneOffset * 60 * 1000)

    // Extract the date parts for the EST Timezone
    const year = currentDateEST.getFullYear()
    const month = String(currentDateEST.getMonth()+1).padStart(2, "0") // Months are 0-based in JS
    const day = String(currentDateEST.getDate()).padStart(2, "0")

    const timeZoneOffsetISO = convertOffsetToISO(timeZoneOffsetMinutes)
    const timeMin = `${year}-${month}-${day}T00:00:00${timeZoneOffsetISO}` // Start of the day in EST
    const timeMax = `${year}-${month}-${day}T23:59:59${timeZoneOffsetISO}` // End of the day in EST

    console.log(`timeMin is ${timeMin}`)
    console.log(`timeMax is ${timeMax}`)

    async function getLetterDay() {
        let todaysEvents = await getTodaysEvents()
        console.log(todaysEvents)

        // Check if letterDay array is not empty
        if (todaysEvents.length > 0 && todaysEvents[0] && todaysEvents[0].summary) {
            let letterDayExtracted
            let sanityCounter = 0
            todaysEvents.forEach(event => {
                if (extractLetterDay(event.summary) !== "🤷‍♂️") {
                    sanityCounter++
                    letterDayExtracted = extractLetterDay(event.summary)
                }
            })
            if (letterDayExtracted === undefined) {
                letterDayExtracted = "🤷‍♂️"
            } else if (sanityCounter > 1) {
                console.log(`sanityCounter is ${sanityCounter}`)
                // Handle the edge case where multiple letter days are found.
                console.error("Multiple letter days were found for today. This is most probably a bug.")
                letterDayExtracted = "😐"
            }
            sanityCounter = 0
            return letterDayExtracted
        } else {
            // Handle the case where no matching letter day is found
            console.log("No letter day found in today's events.")
            return "🤷‍♂️"  // or some default value or throw an error
        }
    }

    async function getTodaysEvents() {
        // You need to define this function based on your application logic.
        // Assuming it fetches events from Google Calendar API or similar
        const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events?key=${API_KEY}&timeMin=${timeMin}&timeMax=${timeMax}&timeZone=${CALENDAR_TZ}`)
        const data = await response.json()
        return data.items
    }

    return {
        getTodaysEvents,
        getLetterDay,
    }
})()

const clockEl = document.querySelector("#clock")
const letterDayEl = document.querySelector("#letterDay")
const iconContainerIcons = document.getElementsByClassName("iconContainer")
const bellScheduleButton = document.getElementById("bell-schedule-button")
const bellScheduleContainer = document.querySelector("#bellScheduleContainer")
const modalOverlay = document.getElementById("modal-overlay")
const emblem = document.getElementById("emblem")
const loader = document.getElementsByClassName("loader")[0]

// Stolen from https://stackoverflow.com/a/68593283
function getTimeZoneOffsetFromName(timeZone) {
    const date = new Date()
    const utcDate = new Date(date.toLocaleString("en-US", { timeZone: "UTC" }))
    const tzDate = new Date(date.toLocaleString("en-US", { timeZone }))
    // This is the worst code I have written.
    if (-(tzDate.getTime() - utcDate.getTime()) === -0) {
        return 0
    } else {
        return -(tzDate.getTime() - utcDate.getTime()) / 6e4
    }
}

function convertOffsetToISO(offsetSeconds) {
    let newOffset
    let offsetAbsoluteSeconds = Math.abs(offsetSeconds)
    switch (Math.sign(offsetSeconds)) {
        case -1:
            newOffset = "+"
            break
        case 0:
            newOffset = "+"
            break
        case 1:
            newOffset = "-"
            break
    }
    let hours = Math.floor(offsetAbsoluteSeconds / 60)
    let minutes = offsetAbsoluteSeconds % 60
    hours = String(hours).padStart(2, "0")
    minutes = String(minutes).padStart(2, "0")
    newOffset = newOffset.concat(`${hours}:${minutes}`)
    return newOffset
}

function extractLetterDay(description) {
    // Is there any way to optimize this atrocity?
    const exactlyMatchesLetterA = ["A", "A ", " A", " A ", "A  ", "  A", "  A  "] 
    const startsWithLetterA = ["A - Assembly", "A- Assembly", " A -Assembly", "A-Assembly", " A - Assembly", " A- Assembly", " A -Assembly", " A-Assembly", "A (Cycle", "A(Cycle", "A ( Cycle", "A( Cycle", " A (Cycle", " A(Cycle", " A (Cycle", " A(Cycle", " A ( Cycle", " A( Cycle", "A (End of MP", "A(End of MP", "A ( End of MP", "A( End of MP", " A (End of MP", " A(End of MP", " A (End of MP", " A(End of MP", " A ( End of MP", " A( End of MP"]
    const exactlyMatchesLetterB = ["B", "B ", " B", " B ", "B  ", "  B", "  B  "]
    const startsWithLetterB = ["B - Assembly", "B- Assembly", " B -Assembly", "B-Assembly", " B - Assembly", " B- Assembly", " B -Assembly", " B-Assembly", "B (Cycle", "B(Cycle", "B ( Cycle", "B( Cycle", " B (Cycle", " B(Cycle", " B (Cycle", " B(Cycle", " B ( Cycle", " B( Cycle", "B (End of MP", "B(End of MP", "B ( End of MP", "B( End of MP", " B (End of MP", " B(End of MP", " B (End of MP", " B(End of MP", " B ( End of MP", " B( End of MP"]
    const exactlyMatchesLetterC = ["C", "C ", " C", " C ", "C  ", "  C", "  C  "]
    const startsWithLetterC = ["C - Assembly", "C- Assembly", " C -Assembly", "C-Assembly", " C - Assembly", " C- Assembly", " C -Assembly", " C-Assembly", "C (Cycle", "C(Cycle", "C ( Cycle", "C( Cycle", " C (Cycle", " C(Cycle", " C (Cycle", " C(Cycle", " C ( Cycle", " C( Cycle", "C (End of MP", "C(End of MP", "C ( End of MP", "C( End of MP", " C (End of MP", " C(End of MP", " C (End of MP", " C(End of MP", " C ( End of MP", " C( End of MP"]
    const exactlyMatchesLetterD = ["D", "D ", " D", " D ", "D  ", "  D", "  D  "]
    const startsWithLetterD = ["D - Assembly", "D- Assembly", " D -Assembly", "D-Assembly", " D - Assembly", " D- Assembly", " D -Assembly", " D-Assembly", "D (Cycle", "D(Cycle", "D ( Cycle", "D( Cycle", " D (Cycle", " D(Cycle", " D (Cycle", " D(Cycle", " D ( Cycle", " D( Cycle", "D (End of MP", "D(End of MP", "D ( End of MP", "D( End of MP", " D (End of MP", " D(End of MP", " D (End of MP", " D(End of MP", " D ( End of MP", " D( End of MP"]
    const exactlyMatchesLetterE = ["E", "E ", " E", " E ", "E  ", "  E", "  E  "]
    const startsWithLetterE = ["E - Assembly", "E- Assembly", " E -Assembly", "E-Assembly", " E - Assembly", " E- Assembly", " E -Assembly", " E-Assembly", "E (Cycle", "E(Cycle", "E ( Cycle", "E( Cycle", " E (Cycle", " E(Cycle", " E (Cycle", " E(Cycle", " E ( Cycle", " E( Cycle", "E (End of MP", "E(End of MP", "E ( End of MP", "E( End of MP", " E (End of MP", " E(End of MP", " E (End of MP", " E(End of MP", " E ( End of MP", " E( End of MP"]
    const exactlyMatchesLetterF = ["F", "F ", " F", " F ", "F  ", "  F", "  F  "]
    const startsWithLetterF = ["F - Assembly", "F- Assembly", " F -Assembly", "F-Assembly", " F - Assembly", " F- Assembly", " F -Assembly", " F-Assembly", "F (Cycle", "F(Cycle", "F ( Cycle", "F( Cycle", " F (Cycle", " F(Cycle", " F (Cycle", " F(Cycle", " F ( Cycle", " F( Cycle", "F (End of MP", "F(End of MP", "F ( End of MP", "F( End of MP", " F (End of MP", " F(End of MP", " F (End of MP", " F(End of MP", " F ( End of MP", " F( End of MP"]
    const exactlyMatchesLetterG = ["G", "G ", " G", " G ", "G  ", "  G", "  G  "]
    const startsWithLetterG = ["G - Assembly", "G- Assembly", " G -Assembly", "G-Assembly", " G - Assembly", " G- Assembly", " G -Assembly", " G-Assembly", "G (Cycle", "G(Cycle", "G ( Cycle", "G( Cycle", " G (Cycle", " G(Cycle", " G (Cycle", " G(Cycle", " G ( Cycle", " G( Cycle", "G (End of MP", "G(End of MP", "G ( End of MP", "G( End of MP", " G (End of MP", " G(End of MP", " G (End of MP", " G(End of MP", " G ( End of MP", " G( End of MP"]
    const exactlyMatchesLetterH = ["H", "H ", " H", " H ", "H  ", "  H", "  H  "]
    const startsWithLetterH = ["H - Assembly", "H- Assembly", " H -Assembly", "H-Assembly", " H - Assembly", " H- Assembly", " H -Assembly", " H-Assembly", "H (Cycle", "H(Cycle", "H ( Cycle", "H( Cycle", " H (Cycle", " H(Cycle", " H (Cycle", " H(Cycle", " H ( Cycle", " H( Cycle", "H (End of MP", "H(End of MP", "H ( End of MP", "H( End of MP", " H (End of MP", " H(End of MP", " H (End of MP", " H(End of MP", " H ( End of MP", " H( End of MP"]
    if (exactlyMatchesLetterA.includes(description)) {
        return "A"
    } else if (startsWithLetterA.some(substr => description.startsWith(substr))) {
        return "A"
    } else if (exactlyMatchesLetterB.includes(description)) {
        return "B"
    } else if (startsWithLetterB.some(substr => description.startsWith(substr))) {
        return "B"
    } else if (exactlyMatchesLetterC.includes(description)) {
        return "C"
    } else if (startsWithLetterC.some(substr => description.startsWith(substr))) {
        return "C"
    } else if (exactlyMatchesLetterD.includes(description)) {
        return "D"
    } else if (startsWithLetterD.some(substr => description.startsWith(substr))) {
        return "D"
    } else if (exactlyMatchesLetterE.includes(description)) {
        return "E"
    } else if (startsWithLetterE.some(substr => description.startsWith(substr))) {
        return "E"
    } else if (exactlyMatchesLetterF.includes(description)) {
        return "F"
    } else if (startsWithLetterF.some(substr => description.startsWith(substr))) {
        return "F"
    } else if (exactlyMatchesLetterG.includes(description)) {
        return "G"
    } else if (startsWithLetterG.some(substr => description.startsWith(substr))) {
        return "G"
    } else if (exactlyMatchesLetterH.includes(description)) {
        return "H"
    } else if (startsWithLetterH.some(substr => description.startsWith(substr))) {
        return "H"
    } else {
        // Handle the case where no matching letter day is found
        console.log(`No letter day extracted for description: ${description}`)
        return "🤷‍♂️"  // or some default value or throw an error
    }
}

function runOncePerDay() {
    // Check if last execution date is stored
    // var fake_date = new Date("April 17, 2024 11:13:00")

    //overriding date function
    // Date = function(){return fake_date;}
    // var currentDate = new Date()
    // alert(currentDate)

    let lastExecutionDate = localStorage.getItem("lastExecutionDate")
    currentDate = new Date().toLocaleDateString()

    // If last execution date doesn't exist or it's different from today
    if (!lastExecutionDate || lastExecutionDate !== currentDate) {
        // Run your function here
        console.log("This function is being executed once today.")
        console.log("Current date:", currentDate)
        console.log("Last Execution date: ", lastExecutionDate)

        // Update last execution date
        localStorage.setItem("lastExecutionDate", currentDate)

        return
    }
    else {
        console.log("This function has already executed today.")
        console.log("Last execution date:", lastExecutionDate)
        console.log("Current date:", currentDate)

        return
    }
}

let bellScheduleShown = false

function updateTime() {
    let d = new Date()
    currentTime = `${d.getHours() % 12 == 0 ? 12 : d.getHours() % 12}:${d
        .getMinutes()
        .toString()
        .padStart(2, "0")}:${d.getSeconds().toString().padStart(2, "0")}`
    currentTimeTitle = `The current time is: ${currentTime}`
    // Although updateTime is called every millisecond, we should only update the DOM when it's needed
    if (clockEl.innerHTML != currentTime) {
        clockEl.innerHTML = currentTime
    }
    if (clockEl.getAttribute("title") != currentTimeTitle) {
        clockEl.setAttribute("title", currentTimeTitle)
    }
}

async function getDate() {
    try {
        let currentLetterDay = await calendarManager.getLetterDay()
        console.log(`Current Letter Day: ${currentLetterDay}`)
        switch (currentLetterDay) {
            case "🤷‍♂️":
                letterDayEl.setAttribute("title", "No letter day found for today. Hit refresh to try again.")
                break
            case "😐":
                letterDayEl.setAttribute("title", "Multiple letter days were found for today. This is most probably a bug.")
                break
            default:
                // "US/Eastern" and "EST5EDT" are linked to "America/New_York" so we have to check for them too. This may not be necessary, but I don't care. https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
                if (currentTimeZone == "America/New_York" || currentTimeZone == "US/Eastern" || currentTimeZone == "EST5EDT") {
                    letterDayEl.setAttribute("title", `The current letter day is ${currentLetterDay}-DAY. Last updated on: ${(new Date()).toLocaleString("en-US")} (refresh to update)`)
                } else {
                    letterDayEl.setAttribute("title", `⚠️ This letter day is based on Prep's time zone, which doesn't match yours (${currentTimeZone})\nThe current letter day is ${currentLetterDay}-DAY. Last updated on: ${(new Date()).toLocaleString()} (your local time, refresh to update)`)
                    currentLetterDay = `⚠️ ${currentLetterDay}`
                }
            currentLetterDay = `${currentLetterDay}-DAY`
        }
        letterDayEl.innerHTML = currentLetterDay
    } catch (e) {
        console.log(e)
        letterDayEl.innerHTML = "🤯"
        letterDayEl.setAttribute("title", "Woah! Something went wrong. Hit refresh to try again.")
        let errorPopup = document.createElement("div")
        errorPopup.classList.add("errorPopupContainer")
        let errorPopupText = document.createElement("p")
        errorPopupText.innerHTML = "Couldn't query School Calendar. Refresh the page to try again"
        errorPopup.appendChild(errorPopupText)
        document.body.appendChild(errorPopup)
    }
}

function changeSeasonalBackground(month, day) {
    month += 1
    let imageUrl
    if (month == 12 || month <= 2) {
        // WINTER
        imageUrl = "../img/fall_winter.webp"
    } else if (month >= 3 && month <= 5) {
        // SPRING
        imageUrl = "../img/spring_summer.webp"
    } else if (month >= 6 && month <= 9) {
        // SUMMER
        imageUrl = "../img/spring_summer.webp"
    } else {
        // FALL
        imageUrl = "../img/fall_winter.webp"
    }
    // April Fools functionality
    if (month == 4 && day == 1) {
        console.log("rickroll mode activated")
        imageUrl = "../img/secret/rickroll.avif"
    }
    document.documentElement.style.setProperty(
        "--background-seasonal",
        `url("${imageUrl}")`
    )
}

async function toggleBellSchedule() {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
    console.log("Toggle: Bell Schedule")
    if (!bellScheduleShown) {
        Array.from(iconContainerIcons).forEach(element => {
            element.tabIndex = "-1"
        })
        bellScheduleContainer.style.display = "flex"
        bellScheduleContainer.style.opacity = "1"
        await sleep(250)
    } else {
        Array.from(iconContainerIcons).forEach(element => {
            element.removeAttribute("tabindex")
        })
        bellScheduleContainer.style.opacity = "0"
        await sleep(250)
        bellScheduleContainer.style.display = "none"
        console.log(bellScheduleContainer.style.opacity)
    }
    bellScheduleShown = !bellScheduleShown
}

document.addEventListener("keydown", (e) => {
    if (!e.repeat && e.key === "Escape" ) {
        if (bellScheduleShown) {
            toggleBellSchedule()
        }
    }
})

function hideLoader() {
    loader.style.display = "none"
}

function hideModalOverlay() {
    modalOverlay.hidden = true
}

function showModalOverlay() {
    try {
        modalOverlay.contentWindow.sanityCheck()
        modalOverlay.hidden = false
        modalOverlay.contentWindow.openPasscodeModal()
    } catch {
        alert("Sorry, the modal overlay is not working correctly. Try again later.\nIf you are using the \"file:\" URL scheme, please run this extension by enabling developer mode in Chrome and loading this extension unpacked. (This avoids issues with CORS, if that is the issue)")
    }
}

function applySecretSettings() {
    switch (localStorage.getItem("secretSettings_fontSelection")) {
        case "sans-serif":
            document.documentElement.style.setProperty("--selected-font-family", "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif")
            break
        case "inter":
            document.documentElement.style.setProperty("--selected-font-family", "Inter, sans-serif")
            break
        case "lato":
            document.documentElement.style.setProperty("--selected-font-family", "Lato, sans-serif")
            break
        case "montserrat":
            document.documentElement.style.setProperty("--selected-font-family", "Montserrat, sans-serif")
            break
        case "nunito":
            document.documentElement.style.setProperty("--selected-font-family", "Nunito, sans-serif")
            break
        case "poppins":
            document.documentElement.style.setProperty("--selected-font-family", "Poppins, sans-serif")
            break
        case "raleway":
            document.documentElement.style.setProperty("--selected-font-family", "Raleway, sans-serif")
            break
        case "rubik":
            document.documentElement.style.setProperty("--selected-font-family", "Rubik, sans-serif")
            break
        default:
            localStorage.removeItem("secretSettings_fontSelection")
    }

    switch (localStorage.getItem("secretSettings_backgroundSelection")) {
        case "bliss":
            document.documentElement.style.setProperty("--selected-background", "url(../img/secret/bliss_windows_xp.webp)")
            break
        case "osx-tiger":
            document.documentElement.style.setProperty("--selected-background", "url(../img/secret/osx_tiger.webp)")
            break
        case "osx-leopard":
            document.documentElement.style.setProperty("--selected-background", "url(../img/secret/osx_leopard.webp)")
            break
        case "osx-lion":
            document.documentElement.style.setProperty("--selected-background", "url(../img/secret/osx_lion.webp)")
            break
        case "osx-yosemite":
            document.documentElement.style.setProperty("--selected-background", "url(../img/secret/osx_yosemite.webp)")
            break
        case "msc-building":
            document.documentElement.style.setProperty("--selected-background", "url(../img/spring_summer.webp)")
            break
        case "snow":
            document.documentElement.style.setProperty("--selected-background", "url(../img/fall_winter.webp)")
            break
        case "snow-low-quality":
            document.documentElement.style.setProperty("--selected-background", "url(../img/secret/snow_low_quality.webp)")
            break
        case "original-fall-winter":
            document.documentElement.style.setProperty("--selected-background", "url(../img/secret/original_fall_winter.webp)")
            break
        case "street-view":
            document.documentElement.style.setProperty("--selected-background", "url(../img/secret/street_view.webp)")
            break
        case "street-view-better":
            document.documentElement.style.setProperty("--selected-background", "url(../img/secret/street_view_better.webp)")
            break
        case "rickroll":
            document.documentElement.style.setProperty("--selected-background", "url(../img/secret/rickroll.avif)")
            break
        default:
            document.documentElement.style.setProperty("--selected-background", "var(--background-seasonal)")
            localStorage.removeItem("secretSettings_backgroundSelection")
    }

    if (localStorage.getItem("secretSettings_gradientSelection") === "#9b042a") {
        localStorage.removeItem("secretSettings_gradientSelection")
    }
    if (/^#[0-9A-F]{6}$/i.test(localStorage.getItem("secretSettings_gradientSelection"))) {
        document.documentElement.style.setProperty("--selected-gradient", localStorage.getItem("secretSettings_gradientSelection"))
    } else {
        document.documentElement.style.setProperty("--selected-gradient", "rgba(155, 4, 43, 1)")
        localStorage.removeItem("secretSettings_gradientSelection")
    }
}

emblem.addEventListener("dblclick", () => {
    if (window.location.protocol === "file:") {
        alert("It looks like you are running this extension's page locally using the \"file:\" URL scheme.\nSince browsers consider pages on the local filesystem as from separate origins, we have canceled your action to avoid issues.")
    } else {
        showModalOverlay()
    }
})

bellScheduleButton.addEventListener("click", () => {
    toggleBellSchedule()
})

bellScheduleContainer.addEventListener("click", () => {
    toggleBellSchedule()
})

changeSeasonalBackground((new Date).getMonth(), (new Date).getDate())
updateTime()
setInterval(updateTime, 1) // Calling updateTime every 1000 ms causes noticeable lag (many milliseconds) so we instead call it every millisecond to avoid this problem
getDate()
runOncePerDay()
window.addEventListener("load", () => {
    applySecretSettings()
    hideLoader()
})