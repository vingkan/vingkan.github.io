function globalStart(){
	setRoomKey();
	initListening(true);
}

function globalStop(){
	initListening(false);
	endSession();
}

function setRoomKey(){
	ROOM_KEY = document.getElementById("roomKeyInput").value;
	joinRoom(ROOM_KEY); // how do we know this even exists
}

function initListening(listenBoolean){
	console.log(listenBoolean);
	setListening(ROOM_KEY, listenBoolean);
	console.log(ROOM_KEY +": " + listenBoolean);
	startListening();
}

var reference;

function printResults(device){
	var output = document.getElementById('output');
	output.innerHTML = "";
	console.log("PRINT RESULTS:");
	console.log(device);
	output.innerHTML += "<h2>" + device.key + "</h2>"
	output.innerHTML += "<ul>";
	var size = device.results.length;
	for(var r = 0; r < size; r++){
		output.innerHTML += resultToHTML(device.results[r])
	}
	output.innerHTML += "</ul>";
}

//init();

console.log('LOADED FRONTEND');