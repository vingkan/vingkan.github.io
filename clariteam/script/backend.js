var url = "https://claritk.firebaseio.com/";
var firebase = new Firebase("https://claritk.firebaseio.com/");
var firebaseRooms = new Firebase("https://claritk.firebaseio.com/Rooms");
var listening;

// This function may not need to be used
function addDevice(room, userIp) {
	var newDevice = new Firebase(url+"Rooms/"+room+"/"+userIp);
	newDevice.push(0);
}

function pushResult(room, userIp, parseData) {
	console.log(room + "/" + userIp)
	var pushData = new Firebase(url+"Rooms/"+room+"/"+userIp);
	pushData.push({confidence: parseData['confidence'],
					transcript: parseData['transcript']});

}

function setListening(room, bool) {
	var newListener = new Firebase(url+"Rooms/"+room+"/LISTENING");
	console.log("set listening to: "+bool);
	newListener.set(bool);
}

/*
* TEMPORARILY TURNED OFF SINCE WE WON'T BE NEED ARRAYS FOR NOW!
*/
function notifyDevices(room) {
	/*var listenDir = new Firebase(url+"Rooms/"+room+"/LISTENING");
	listenDir.on('value', function(snapshot){
		alert(snapshot.val());
		if (snapshot.val()) {
			startListening();
		}
	});*/
}

var getResultsOutput = [];

function getResults(room, callback) {
	var ref = new Firebase("https://claritk.firebaseio.com/Rooms/" + room);
	var roomData = null;
	ref.on('value', function(snapshot){
		roomData = snapshot.val();
		console.log(roomData);
		$.each(roomData, function(key, value){
			if(key != "LISTENING"){
				var deviceResults = [];
				$.each(value, function(forget, result){
					deviceResults.push(result);
				});
				console.log(deviceResults)
				var deviceObject = {
					key: key,
					results: deviceResults
				}
				getResultsOutput.push(deviceObject);
			}
		});
		callback();
	});
}

/*function init(){
	ROOM_KEY = 'mobihack';
	DEVICE_KEY = '104-194-113-25';
}*/


console.log('LOADED BACKEND');

