const clockEl = document.querySelector("#clock");
const letterDayEl = document.querySelector("#letterDay")
const dateEl = document.querySelector("#date");
const bellScheduleContainer = document.querySelector("#bellScheduleContainer")

// Global variable 
document.documentElement.style.setProperty('--season-background', 'MSCBuilding.jpg');

let bellScheduleShown = false;
const homeShortcuts = []

updateTime();
setInterval(updateTime, 1000);
getDate();

function updateTime() {
	let d = new Date();
	clockEl.innerHTML = `${d.getHours() % 12 == 0 ? 12 : d.getHours() % 12}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')} `;
}

async function getDate() {
	let d = new Date();

	let response = await fetch("../schoolCalender.json");
	let dayData;
	if (response.ok) {
		let data = await response.json();
		let dateId = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
		dayData = data.find((e) => e.date == dateId);
	}
	if (dayData != undefined) {
		letterDayEl.innerHTML = dayData.letter + " - DAY";
		document.querySelector("#bufferBar").style.display = "block";
	}
	dateEl.innerHTML = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
}

async function changeBackground() {
	let date = new Date();
	var season;
	var month = date.getMonth() + 1; // January is normally 0 and December is 11. Hence why we add +1 to make it easier
	// var month = 6;
		if (month >= 9 && month <= 11) {
		  	var season = "../img/MSCBuildingFall.webp"; // TODO: Actual Image
		}
		else if (month == 12 || month == 1 || month == 2){
			var season = "../img/Test.png"; // TODO: Actual Image
		}
		else if (month >= 6 && month <= 8){
			var season = "../img/MSCBuildingTest.png"; // TODO: Actual Image
		}
		else {
			var season = "Placeholder"; // TODO: Actual Image
		}
	console.log("season "+ season);
	console.log("month "+ month);
	document.documentElement.style.setProperty('--season-background', `url('${season}')`);
}

async function toggleBellSchedule() {
	console.log("toggle");
	if(!bellScheduleShown) {
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

const sleep = ms => new Promise(r => setTimeout(r, ms));
