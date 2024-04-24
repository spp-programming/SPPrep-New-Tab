let calendarManager = (() => {
    const API_KEY = "AIzaSyCOQ3EYDqe7-ypGvnNb1NZQN6Ib2eb7LG0";
    const CALENDAR_ID = "144grand@gmail.com";

    const currentDate = new Date().toISOString().split("T")[0].split("-");

    console.log(currentDate);

    const timeMin =
        `${currentDate[0]}-${currentDate[1]}-${parseInt(currentDate[2]) - 0}` +
        "T00:00:00Z";
    const timeMax =
        `${currentDate[0]}-${currentDate[1]}-${parseInt(currentDate[2]) + 0}` +
        "T23:59:59Z";

    console.log(timeMin);
    console.log(timeMax);

    const letterDays = "ABCDEFGH";

    function runOncePerDay() {
        // Check if last execution date is stored
        // var fake_date = new Date("April 17, 2024 11:13:00");
    
        //overriding date function
        // Date = function(){return fake_date;};
        // var currentDate = new Date();
        // alert(currentDate);
    
        let lastExecutionDate = localStorage.getItem('lastExecutionDate');
        currentDate = new Date().toLocaleDateString();
    
        // If last execution date doesn't exist or it's different from today
        if (!lastExecutionDate || lastExecutionDate !== currentDate) {
            // Run your function here
            console.log("Function executed once today");
            console.log("Current date:", currentDate);
            console.log("Last Execution date: ", lastExecutionDate)
    
            // Update last execution date
            localStorage.setItem('lastExecutionDate', currentDate);
    
            return
        }
        else {
            console.log("It already executed");
            console.log("Last execution date:", lastExecutionDate);
            console.log("Current date:", currentDate);
    
            return
        }
    }

    async function getTodaysEvents() {
        try {
            const response = await fetch(
                `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events?key=${API_KEY}&timeMin=${timeMin}&timeMax=${timeMax}`
            );

            const data = await response.json();

            console.log(data.items);

            return data.items;

            return data.items.filter((item) =>
                letterDays.includes(item.summary)
            );
        } catch (error) {
            console.error("Error fetching today's events:", error);
            return []; // Return an empty array or handle the error as needed
        }
    }

    async function getLetterDay() {
        let todaysEvents = await getTodaysEvents();
        console.log(todaysEvents);
        let letterDay = todaysEvents.filter((item) =>
            letterDays.includes(item.summary)
        );
        return letterDay[0]["summary"].slice(0, 1);
    }

    getTodaysEvents().then(console.log);

    return {
        getTodaysEvents,
        getLetterDay,
    };
})();

const clockEl = document.querySelector("#clock");
const letterDayEl = document.querySelector("#letterDay");
const dateEl = document.querySelector("#date");
const bellScheduleContainer = document.querySelector("#bellScheduleContainer");

// Global variable
document.documentElement.style.setProperty(
    "--season-background",
    "MSCBuilding.jpg"
);

let bellScheduleShown = false;
const homeShortcuts = [];

updateTime();
setInterval(updateTime, 1000);
getDate();

function updateTime() {
    let d = new Date();
    clockEl.innerHTML = `${d.getHours() % 12 == 0 ? 12 : d.getHours() % 12}:${d
        .getMinutes()
        .toString()
        .padStart(2, "0")}:${d.getSeconds().toString().padStart(2, "0")} `;
}

async function getDate() {
    // let d = new Date();
    // changeBackground(d.getMonth());

    // let response = await fetch("../schoolCalender.json");
    // let dayData;
    // if (response.ok) {
    //     let data = await response.json();
    //     let dateId = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
    //     dayData = data.find((e) => e.date == dateId);
    // }
    // if (dayData != undefined) {
    //     letterDayEl.innerHTML = dayData.letter + " - DAY";
    //     document.querySelector("#bufferBar").style.display = "block";
    // }
    // dateEl.innerHTML = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
    letterDayEl.innerHTML = "...";
    try {
        letterDayEl.innerHTML = (await calendarManager.getLetterDay()) + "-DAY";
    } catch (e) {
        console.log(e);
        letterDayEl.innerHTML = "...";
        let errorPopup = document.createElement("div");
        errorPopup.classList.add("errorPopupContainer");
        let errorPopupText = document.createElement("p");
        errorPopupText.innerHTML = "Looks like you're offline.";
        errorPopup.appendChild(errorPopupText);
        document.body.appendChild(errorPopup);
    }
}

function changeBackground(month) {
    month += 1;
    let imageUrl;
    if (month == 12 || month <= 2) {
        // WINTER
        imageUrl = "../img/MSCBuildingFall.webp";
    } else if (month >= 3 && month <= 5) {
        // SPRING
        imageUrl = "../img/Test.png";
    } else if (month >= 6 && month <= 9) {
        // SUMMER
        imageUrl = "../img/MSCBuildingTest.png";
    } else {
        // FALL
        imageUrl = "Placeholder";
    }
    document.documentElement.style.setProperty(
        "--season-background",
        `url('${imageUrl}')`
    );
}

async function toggleBellSchedule() {
    console.log("toggle");
    if (!bellScheduleShown) {
        bellScheduleContainer.style.display = "flex";
        bellScheduleContainer.style.opacity = "1";
        await sleep(250);
    } else {
        bellScheduleContainer.style.opacity = "0";
        await sleep(250);
        bellScheduleContainer.style.display = "none";
        console.log(bellScheduleContainer.style.opacity);
    }
    bellScheduleShown = !bellScheduleShown;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
