let calendarManager = (() => {
    const API_KEY = "AIzaSyCOQ3EYDqe7-ypGvnNb1NZQN6Ib2eb7LG0"
    const CALENDAR_ID = "144grand@gmail.com"

    // Get the current date in UTC
    const currentDateUTC = new Date()

    // Get the time zone offset in minutes for the current date
    const timeZoneOffsetMinutes = currentDateUTC.getTimezoneOffset()

    // Convert the current date to EST by adjusting according to timezone offset
    const timeZoneOffset = -timeZoneOffsetMinutes; // EST offset in minutes
    const currentDateEST = new Date(currentDateUTC.getTime() + timeZoneOffset * 60 * 1000)

    // Extract the date parts for the EST Timezone
    const year = currentDateEST.getFullYear()
    const month = String(currentDateEST.getMonth()+1).padStart(2, '0'); // Months are 0-based in JS
    const day = String(currentDateEST.getDate()).padStart(2, '0')

    const timeMin = `${year}-${month}-${day}T00:00:00-05:00`; // Start of the day in EST
    const timeMax = `${year}-${month}-${day}T23:59:59-05:00`; // End of the day in EST

    console.log(timeMin)
    console.log(timeMax)

    const letterDays = "ABCDEFGH"

    async function getLetterDay() {
        let todaysEvents = await getTodaysEvents()
        console.log(todaysEvents)
        let letterDay = todaysEvents.filter((item) =>
            letterDays.includes(item.summary)
        )

        // Check if letterDay array is not empty
        if (letterDay.length > 0 && letterDay[0] && letterDay[0].summary) {
            return letterDay[0].summary.slice(0, 1)
        } else {
            // Handle the case where no matching letter day is found
            console.error("No letter day found in today's events.")
            return "NoLetter";  // or some default value or throw an error
        }
    }

    async function getTodaysEvents() {
        // You need to define this function based on your application logic.
        // Assuming it fetches events from Google Calendar API or similar
        const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events?key=${API_KEY}&timeMin=${timeMin}&timeMax=${timeMax}`)
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
const dateEl = document.querySelector("#date")
const bellScheduleContainer = document.querySelector("#bellScheduleContainer")

// Global variable
document.documentElement.style.setProperty(
    "--season-background",
    "MSCBuilding.jpg"
)

function runOncePerDay() {
    // Check if last execution date is stored
    // var fake_date = new Date("April 17, 2024 11:13:00")

    //overriding date function
    // Date = function(){return fake_date;}
    // var currentDate = new Date()
    // alert(currentDate)

    let lastExecutionDate = localStorage.getItem('lastExecutionDate')
    currentDate = new Date().toLocaleDateString()

    // If last execution date doesn't exist or it's different from today
    if (!lastExecutionDate || lastExecutionDate !== currentDate) {
        // Run your function here
        console.log("Function executed once today")
        console.log("Current date:", currentDate)
        console.log("Last Execution date: ", lastExecutionDate)

        // Update last execution date
        localStorage.setItem('lastExecutionDate', currentDate)

        return
    }
    else {
        console.log("It already executed")
        console.log("Last execution date:", lastExecutionDate)
        console.log("Current date:", currentDate)

        return
    }
}

let bellScheduleShown = false
const homeShortcuts = []

function updateTime() {
    let d = new Date()
    clockEl.innerHTML = `${d.getHours() % 12 == 0 ? 12 : d.getHours() % 12}:${d
        .getMinutes()
        .toString()
        .padStart(2, "0")}:${d.getSeconds().toString().padStart(2, "0")} `
}

async function getDate() {
    // let d = new Date()
    // changeBackground(d.getMonth())

    // let response = await fetch("../schoolCalender.json")
    // let dayData
    // if (response.ok) {
    //     let data = await response.json()
    //     let dateId = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`
    //     dayData = data.find((e) => e.date == dateId)
    // }
    // if (dayData != undefined) {
    //     letterDayEl.innerHTML = dayData.letter + " - DAY"
    //     document.querySelector("#bufferBar").style.display = "block"
    // }
    // dateEl.innerHTML = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`
    letterDayEl.innerHTML = "..."
    try {
        letterDayEl.innerHTML = (await calendarManager.getLetterDay()) + "-DAY"
    } catch (e) {
        console.log(e)
        letterDayEl.innerHTML = "..."
        let errorPopup = document.createElement("div")
        errorPopup.classList.add("errorPopupContainer")
        let errorPopupText = document.createElement("p")
        errorPopupText.innerHTML = "Looks like you're offline."
        errorPopup.appendChild(errorPopupText)
        document.body.appendChild(errorPopup)
    }
}

function changeBackground(month) {
    month += 1
    let imageUrl
    if (month == 12 || month <= 2) {
        // WINTER
        imageUrl = "../img/MSCBuildingFallWinter.webp"
    } else if (month >= 3 && month <= 5) {
        // SPRING
        imageUrl = "../img/MSCBuildingSpringSummer.webp"
    } else if (month >= 6 && month <= 9) {
        // SUMMER
        imageUrl = "../img/MSCBuildingSpringSummer.webp"
    } else {
        // FALL
        imageUrl = "../img/MSCBuildingFallWinter.webp"
    }
    document.documentElement.style.setProperty(
        "--season-background",
        `url('${imageUrl}')`
    )}

async function toggleBellSchedule() {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
    console.log("toggle")
    if (!bellScheduleShown) {
        bellScheduleContainer.style.display = "flex"
        bellScheduleContainer.style.opacity = "1"
        await sleep(250)
    } else {
        bellScheduleContainer.style.opacity = "0"
        await sleep(250)
        bellScheduleContainer.style.display = "none"
        console.log(bellScheduleContainer.style.opacity)
    }
    bellScheduleShown = !bellScheduleShown
}

updateTime()
setInterval(updateTime, 1000)
getDate()
runOncePerDay();