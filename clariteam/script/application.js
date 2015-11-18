/*--------------------------------------------*/
/*---> GLOBALS <------------------------------*/
/*--------------------------------------------*/

var ROOM_KEY;
var DEVICE_KEY;

var devices = [];

var currentResult = null;
var parsedData = {
	transcript: "transcript",
	confidence: 0.5
};

/*--------------------------------------------*/
/*---> STEP ONE <-----------------------------*/
/*--------------------------------------------*/

/*
* S/O Link: http://stackoverflow.com/questions/391979/get-client-ip-using-just-javascript
*/
function getDeviceIP() {
	if (window.XMLHttpRequest) xmlhttp = new XMLHttpRequest();
	else xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");

	xmlhttp.open("GET","http://api.hostip.info/get_html.php",false);
	xmlhttp.send();

	hostipInfo = xmlhttp.responseText.split("\n");

	for (i=0; hostipInfo.length >= i; i++) {
		ipAddress = hostipInfo[i].split(":");
		if ( ipAddress[0] == "IP" ){
			return ipAddress[1];
		}
	}

	return false;
}

function joinRoom(roomKey){
	var userIP = getDeviceIP().replace(/\./g,'-');
	DEVICE_KEY = userIP; //addDevice(roomKey, userIP);
}

/*--------------------------------------------*/
/*---> STEP TWO <-----------------------------*/
/*--------------------------------------------*/

function startListening(){
	record();
}

/*--------------------------------------------*/
/*---> STEP THREE <---------------------------*/
/*--------------------------------------------*/

function displayInterimRecognition(){
	var output = document.getElementById('interim-transcript');
	output.innerHTML = "<p>" + getResultTranscript() + "</p>";
	output.innerHTML += '<div class="confidence" style="opacity: ' + getResultConfidence() + ';">' + getResultConfidence().toFixed(3) + '</div>';
}

function record(){
	var recognition = new webkitSpeechRecognition();
		recognition.continuous = true;
		//recognition.interimResults = true;
		recognition.lang = 'en';

	recognition.onresult = function(event){
		currentResult = event;
		console.log("Returned Result:");
		console.log(currentResult);
		console.log(getResultTranscript());
		console.log(getResultConfidence());
		parseResult();
		displayInterimRecognition();
	}

	recognition.start();
}

function parseResult(){
	parsedData.transcript = getResultTranscript();
	parsedData.confidence = getResultConfidence();
	pushResult(ROOM_KEY, DEVICE_KEY, parsedData);
	record();
}

function getResultTranscript(){
	return currentResult.results[0][0]['transcript'];
}

function getResultConfidence(){
	return currentResult.results[0][0]['confidence'];
}

/*--------------------------------------------*/
/*---> STEP FOUR <----------------------------*/
/*--------------------------------------------*/

function resultToHTML(parsedResult){
	return '<li>(' + parsedResult.confidence.toFixed(3) + '): ' + parsedResult.transcript + '</li>';
}

function endSession(){

	function callback(){
		var devices = getResultsOutput;
		console.log(devices);
		var size = devices.length;
		for(var d = 0; d < size; d++){
			printResults(devices[d]);
		}
		console.log("reuslts button clicked");
	}

	getResults(ROOM_KEY, callback);

}

console.log('LOADED APPLICATION');

/*--------------------------------------------*/
/*---> SUBSTITUTES <--------------------------*/
/*--------------------------------------------*/

// function addDevice(roomKey){
// 	return 'device-key1';
// }

// function pushResult(resultData){
// 	console.log("Sent to Database:");
// 	console.log(resultData);
// }

// function printResults(device){
// 	console.log("Printed Results:");
// 	console.log(device);
// }


/*
function getResults(roomKey){
	return [
		{
			key: 'device-key1',
			results: [
				{
					transcript: 'hello',
					confidence: 0.5
				}, 
				{
					transcript: 'world',
					confidence: 0.5
				}, 
				{
					transcript: 'dank',
					confidence: 0.5
				}, 
				{
					transcript: 'memes',
					confidence: 0.5
				}
			]
		}, 
		{
			key: 'device-key1',
			results: [
				{
					transcript: 'hello',
					confidence: 0.5
				}, 
				{
					transcript: 'world',
					confidence: 0.5
				}, 
				{
					transcript: 'dank',
					confidence: 0.5
				}, 
				{
					transcript: 'memes',
					confidence: 0.5
				}
			]
		}, 
		{
			key: 'device-key1',
			results: [
				{
					transcript: 'hello',
					confidence: 0.5
				}, 
				{
					transcript: 'world',
					confidence: 0.5
				}, 
				{
					transcript: 'dank',
					confidence: 0.5
				}, 
				{
					transcript: 'memes',
					confidence: 0.5
				}
			]
		}
	];
}*/

console.log('LOADED SUBSTITUTES');