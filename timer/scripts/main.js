var GLOBAL = {
	DAY: 86400000, //one day in milliseconds
	WEEK: 604800000, //one week in milliseconds
	MINUTE: 60000, //one minute in milliseconds
	HOUR: 3600000 //one hour in milliseconds
}

var STATE = {
	CHECKPOINT: 0,
	LAST: 0,
	LOADED: false
}

var CONFIG = {
	SIMULATION_START: 0,
	SIMULATION_END: 0,
	REAL_START: 0,
	REAL_END: 0
}

var realClock = document.getElementById('real-clock');
var simulationClock = document.getElementById('simulation-clock');
var countdownClock = document.getElementById('countdown-clock');
var checkpointLabel = document.getElementById('checkpoint-label');

var simulationCalendar = document.getElementById('simulation-calendar');
var calendarToolbar = document.getElementById('calendar-toolbar');

vex.defaultOptions.className = 'vex-theme-wireframe';

var PATH = "https://simulation-timer.firebaseio.com/";

function getConfiguration(key){
	var firebase = new Firebase(PATH + key);
	firebase.once("value", function(snapshot){
		var config = snapshot.val();
		if(config !== null){
			CONFIG = config;
			
			createCalendar(simulationCalendar, calendarToolbar, config);
			loadCalendar(simulationCalendar, config);

			setCheckPoint(config.SIMULATION_END);
			STATE.LAST = config.SIMULATION_START;
			STATE.LOADED = true;
			/*document.getElementById("menu").display = "none";
			document.getElementById("main-timer").display = "block";*/
		}
		else{
			getUserKey();
		}
	});
}

window.setInterval(function(){
	if(STATE.LOADED){
		var realNow = new Date().getTime();
		setClock(realNow, CONFIG);
		setCountdown(realNow, STATE.CHECKPOINT, CONFIG);
		//setMonthView(realNow, CONFIG);
	}
}, 25);

getUserKey()

function getUserKey(){
	vex.dialog.prompt({
		message: "Enter the key give to you by your simulation organizer.",
		callback: function(key){
			if(key){
				getConfiguration(key);	
			}
		}
	});
}

/*
 * Returns scale between real time and simulation time
 * Multiply real time by this scalar to get simulation time
 */
function calculateTimeScale(config){
	var simulationDuration = config.SIMULATION_END - config.SIMULATION_START;
	var realDuration = config.REAL_END - config.REAL_START;
	var scale = simulationDuration / realDuration;
	return scale;
}

function getSimulationTime(now, config){
	var realElapsed = now - config.REAL_START;
	var scale = calculateTimeScale(config);
	var simTime = (realElapsed * scale) + config.SIMULATION_START;
	return simTime;
}

function convertToRealTime(simDuration, config){
	var scale = calculateTimeScale(config);
	var realDuration = (simDuration / scale);
	return realDuration;
}

function minutesToSeconds(minutes){
	var fraction = minutes - Math.floor(minutes);
	var seconds = fraction * 60;
	var displayMinutes = Math.floor(minutes);
	var displaySeconds = Math.floor(seconds).toString().length === 1 ? "0" + Math.floor(seconds) : Math.floor(seconds);
	var time = displayMinutes + " minutes, " + displaySeconds + " seconds";
	return time;
}

//WARNING: ONLY WORKS FOR SIMULATIONS LESS THAN A YEAR LONG
function getMonthInSimulation(timestamp, config){
	var startMonth = new Date(config.SIMULATION_START).getMonth();
	var currentMonth = new Date(timestamp).getMonth();
	return (currentMonth - startMonth);
}

function getWeekInMonthInSimulation(timestamp, config){
	//var startDay = time
}

function setClock(now, config){
	var simTime = getSimulationTime(now, config);
	realClock.innerHTML = moment(now).format("M/D hh:mm:ss A");
	simulationClock.innerHTML = moment(simTime).format("M/D hh:mm A");
}

function showCurrentDate(now, simWeek, config){
	var simTime = getSimulationTime(now, config);
	var simDate = new Date(simTime);
	var monthIndex = getMonthInSimulation(now, config);
	var monthDiv = getMonthDiv(calendarDiv, monthIndex);
	var dateBox = monthDiv.children[simWeek + 1].children[simDate.getDay()];
}

//Returns real time remaining in minutes
function showTimeUntil(timestamp, config){
	var realNow = new Date().getTime();
	var simNow = getSimulationTime(realNow, config);
	var simTimeRemaining = timestamp - simNow;
	var realTimeRemaining = convertToRealTime(simTimeRemaining, config);
	return (realTimeRemaining / GLOBAL.MINUTE);
}

function setCountdown(now, checkpoint, config){
	var realTimeRemaining = showTimeUntil(checkpoint, config);
	countdownClock.innerHTML = minutesToSeconds(realTimeRemaining);
}

function setMonthView(now, config){
	var simTime = getSimulationTime(now, config);
	var simDate = new Date(simTime);
	var lastDate = new Date(STATE.LAST);
	if(simDate.getMonth() !== lastDate.getMonth()){
		var monthIndex = getMonthInSimulation(simTime, config);
		toggleMonthView(simulationCalendar, monthIndex);
	}
}

function setCheckPoint(timestamp){
	STATE.CHECKPOINT = timestamp;
	var label = moment(timestamp).format("M/D");
	checkpointLabel.innerHTML = label;
}

function toggleMonthView(calendarDiv, monthIndex){
	var monthDiv = getMonthDiv(calendarDiv, monthIndex);
	var allMonths = calendarDiv.getElementsByClassName("month");
	$.each(allMonths, function(index, div){
		div.style.display = "none";
	});
	monthDiv.style.display = "block";
}

function createCalendar(calendarDiv, toolbarDiv, config){
	var startMonth = new Date(config.SIMULATION_START).getMonth();
	var endMonth = new Date(config.SIMULATION_END).getMonth();
	var months = (endMonth - startMonth) + 1;
	var currentMonth = startMonth;
	var currentDate = new Date(config.SIMULATION_START);
	for(var m = 0; m < months; m++){
		var labelDiv = document.createElement("h1");
			labelDiv.classList.add("month-label");
			labelDiv.innerHTML = moment(currentDate).format("MMMM YYYY");
		var monthDiv = document.createElement("div");
			monthDiv.classList.add("month");
			monthDiv.appendChild(labelDiv);
			calendarDiv.appendChild(monthDiv);
		var toolbarMonth = document.createElement("button");
			toolbarMonth.classList.add("month-button");
			toolbarMonth.innerHTML = moment(currentDate).format("MMMM YYYY");
			toolbarMonth.id = "month-button-" + m;
			toolbarDiv.appendChild(toolbarMonth);
		currentMonth++;
		currentDate.setMonth(currentDate.getMonth() + 1);
	}
	var monthDivs = calendarDiv.getElementsByClassName("month");
	$.each(monthDivs, function(index, div){
		for(var w = 0; w < 5; w++){
			var weekDiv = document.createElement("div");
				weekDiv.classList.add("week");
				div.appendChild(weekDiv);
		}
	});
	var weekDivs = calendarDiv.getElementsByClassName("week");
	$.each(weekDivs, function(index, div){
		for(var d = 0; d < 7; d++){
			var dayDiv = document.createElement("div");
				dayDiv.classList.add("weekday");
				dayDiv.classList.add("weekday-inactive");
				dayDiv.innerHTML = "-";
				div.appendChild(dayDiv);
		}
	});
	$(".month-button").click(function(event){
		var monthIndex = parseInt(this.id.split("-")[2]);
		toggleMonthView(calendarDiv, monthIndex);
	});
	$(".weekday").click(function(event){
		var timestamp = parseInt(this.id.split("-")[1]);
		setCheckPoint(timestamp);
	});
}

function getMonthDiv(calendarDiv, index){
	var monthDivs = calendarDiv.children;
	return monthDivs[index];
}

function loadCalendar(calendarDiv, config){
	var simMonth = 0;
	var simWeek = 0;
	var simTime = config.SIMULATION_START;
	while(simTime <= config.SIMULATION_END){
		var simDate = new Date(simTime);
		var monthDiv = getMonthDiv(calendarDiv, simMonth);
		var dateBox = monthDiv.children[simWeek + 1].children[simDate.getDay()];
		dateBox.innerHTML = simDate.getDate();
		dateBox.classList.remove("weekday-inactive");
		dateBox.classList.add("weekday-active");
		dateBox.id = "weekday-" + simTime;
		simTime += GLOBAL.DAY;
		if(simDate.getDay() === 6){
			simWeek++;
		}
		if(simDate.getMonth() !== new Date(simTime).getMonth()){
			simMonth++;
			simWeek = 0;
		}
	}
}