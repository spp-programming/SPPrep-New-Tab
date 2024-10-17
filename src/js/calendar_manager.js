let calendarManager = (() => {
    const API_KEY = "AIzaSyCOQ3EYDqe7-ypGvnNb1NZQN6Ib2eb7LG0";
    const CALENDAR_ID = "144grand@gmail.com";

    const currentDate = new Date().toISOString().split("T")[0].split("-");

    console.log(currentDate);

    const timeMin =
        `${currentDate[0]}-${currentDate[1]}-${parseInt(currentDate[2]) - 3}` +
        "T00:00:00Z";
    const timeMax =
        `${currentDate[0]}-${currentDate[1]}-${parseInt(currentDate[2]) + 3}` +
        "T23:59:59Z";

    console.log(timeMin);
    console.log(timeMax);

    const letterDays = "ABCDEFGH";

    async function getTodaysEvents() {
        return fetch(
            `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events?key=${API_KEY}&timeMin=${timeMin}&timeMax=${timeMax}`
        )
            .then((r) => r.json())
            .then((r) =>
                r.items.filter((item) => letterDays.includes(item.summary))
            );
    }

    getTodaysEvents().then(console.log);

    return {
        getTodaysEvents,
    };
})();

export default calendarManager;
