
// Reference to the root of the Firebase database
var database = new Firebase("https://conquiz.firebaseio.com/");
var gamebase = new Firebase("https://towercoord.firebaseio.com/");
var coordbase = gamebase.child("-K2aUIZRYFI5l6Tov1JA");
var towerbase = coordbase.child("towers");
var playerbase = coordbase.child("players");
var troopbase = coordbase.child("troops");
// Reference to the google sheets of questions
var questionsLink = 'https://spreadsheets.google.com/feeds/list/1C1POJrIlpm1R3muE0ImmI_ifxpH_aEfPP-QSyl3o2Kg/1/public/basic?alt=json';

var question;
var questionJSON;
var rows;

/*--------------------------------------------*/
/*---> Get Game -> Whole game dir <-----------*/
/*--------------------------------------------*/
function getGame() {
	//var gameHolder = []; // for futre updates with multi-lobby
	var newGame;
	coordbase.on('child_added', function(update){
		var gameJSON = update.val();
		newGame = new Game({
			id: gameJSON['id'],
			moode: gameJSON['mode'],
			name: gameJSON['name'],
			players: loadPlayers(),
			questions: loadQuestions(),
			//questions: [],
			questionLength: parseFloat(gameJSON['questionLength']),
			rounds: parseFloat(gameJSON['rounds']),
			spawnRate: parseFloat(gameJSON['spawnRate']),
			taskManager: null,
			towers: loadTowers(),
			troops: loadTroops()
		});
	});
	//console.log(newGame)
	return newGame;
}

/*--------------------------------------------*/
/*---> Download Task from Firebase <----------*/
/*--------------------------------------------*/
function loadTasks() {

}

/*--------------------------------------------*/
/*---> Download troops from Firebase <--------*/
/*--------------------------------------------*/
function loadTroops() {
	var troopHolder = [];
	var newTroop;
	troopbase.on('child_added', function(update){
		if (update['Empty'] != "DoNotDelete") { //Stops the empty from being pulled
			var troopJSON = update.val();
			newTroop = new Troop({
				id: update['id'],
				name: update['name'],
				playerID: update['playerID'],
				towerID: update['towerID'],
				question: update['question'],
				alive: update['alive']
			});
			troopHolder.push(newTroop);
		}

	});
	return troopHolder;
}

/*--------------------------------------------*/
/*---> Upload troops to Firebase <------------*/
/*--------------------------------------------*/
function uploadTroops(data) {
	$.each(data, function(index, value){
		troopbase.push({
			id: value['id'],
			name: value['name'],
			playerID: value['playerID'],
			towerID: value['towerID'],
			question: value['question'],
			alive: value['alive']
		});
	});
	setDefaultTroops();
}
function setDefaultTroops(){
		towerbase.once('value', function(snapshot){
		snapshot.forEach(function(childSnapshot){
			var child = childSnapshot.val();
			var path = new Firebase(towerbase.child(childSnapshot.key()).toString());
			path.set({
				id: childSnapshot.key(),
				name: child['name'],
				playerID: child['playerID'],
				towerID: child['towerID'],
				question: child['question'],
				alive: child['child']
			});
		});
	});
}
function updateTroops(data) {
	$.each(data, function(index, value){
		var path = new Firebase(troopbase.child(value['id']).toString());
		if (value['alive'] == false) {
			path.remove(); 
		} else {
			path.set({
				id: value['id'], 
				name: value['name'], 
				playerID: value['playerID'],
				towerID: value['towerID'],
				question: value['question'],
				alive: value['alive']
			});
		}
	});
}
// This will remove all the troops in the troops folder
function removeTroops(data) {
	$.each(data, function(index, value){
		var path = new Firebase(troopbase.child(value['id']).toString());
		path.remove();
	}); 
}


/*--------------------------------------------*/
/*---> Download player from Firebase <--------*/
/*--------------------------------------------*/
function loadPlayers() {
	var playerHolder = [];
	var newPlayer;
	playerbase.on('child_added', function(update) {
		var playerJSON = update.val();
		newPlayer = new Player({
			id: playerJSON['id'],
			icon: playerJSON['icon'],
			color: playerJSON['color'],
			latitude: playerJSON['latitude'], 
			longitude: playerJSON['longitude'],
			troops: JSON.stringify(playerJSON['troops'])
		});
		playerHolder.push(newPlayer);
	});
	return playerHolder;
}


/*--------------------------------------------*/
/*---> Upload player to Firebase <------------*/
/*--------------------------------------------*/
function uploadPlayerbase(data) {
	$.each(data, function(index, value){
		playerbase.push({
			id: value['id'],
			name: value['name'],
			icon: value['team']['icon'], 
			color: value['team']['color'],
			latitude: value['coordinate']['latitude'],
			longitude: value['coordinate']['longitude'],
			troops: JSON.stringify(value['troops'])
		});
	});
	setDefaultPlayer();
}
function setDefaultPlayer(){
	playerbase.once('value', function(snapshot){
		snapshot.forEach(function(childSnapshot){
			var path = new Firebase(playerbase.child(childSnapshot.key()).toString());
			path.set({
				id: childSnapshot.key(),
				name: "",
				icon: "png",
				color: "blue",
				latitude: 0,
				longitude: 0,
				troops: "[]"
			});
		});
	});
}

function updatePlayerbase(data) {
	$.each(data, function(index, value){
		var path = new Firebase(playerbase.child(value['id']).toString());
		path.set({
			id: value['id'],
			name: value['name'],
			icon: value['team']['icon'],
			color: value['team']['color'],
			latitude: value['coordinate']['latitude'],
			longitude: value['coordinate']['longitude'],
			troops: JSON.stringify(value['troops'])
		});
	});
}

/*--------------------------------------------*/
/*---> Download towers from Firebase <--------*/
/*--------------------------------------------*/
function loadTowers() {
	var towerHolder = [];
	var newTower;
	towerbase.on('child_added', function(update) {
		var towerJSON = update.val();
		//console.log(towerJSON);
		newTower = new Tower({
			id: towerJSON['id'],
			name: towerJSON['name'],
			latitude: towerJSON['latitude'],
			longitude: towerJSON['longitude'],
			size: towerJSON['size'],
			player: 'd',//JSON.stringify(towerJSON['player']),
			troops: "[]"
		});
		towerHolder.push(newTower);
	});
	return towerHolder;
}


/*--------------------------------------------*/
/*---> Upload towers to Firebase <------------*/
/*--------------------------------------------*/
function uploadTowerbase(data) {
	$.each(data, function(index, value){
		towerbase.push({id: value['id'],
			name: value['name'],
			latitude: value['coordinate']['latitude'],
			longitude: value['coordinate']['longitude'],
			size: value['size'],
			player: value['player'] });
	});
	//setDefaultTower();
}
function setDefaultTower(){
	towerbase.once('value', function(snapshot){
		snapshot.forEach(function(childSnapshot){
			var path = new Firebase(towerbase.child(childSnapshot.key()).toString());
			path.set({
				id: childSnapshot.key(),
				name: "",
				latitude: 0,
				longitude: 0,
				size: 10,
				player: ""
			});
		});
	});
}

function updateTowerbase(data) {
	$.each(data, function(index, value){
		var path = new Firebase(towerbase.child(value['id']).toString());
		path.set({
			id: value['id'],
			name: value['name'],
			latitude: value['coordinate']['latitude'],
			longitude: value['coordinate']['longitude'],
			size: value['size'],
			player: value['player']
		});
	});
}
// Don't have time - going for hard code
function removeTowerbase() {
	// ToDO: Remove the towers folders which will remove the subfolders, recreate a towers folder.
}


/*--------------------------------------------*/
/*---> Download question from Firebase <------*/
/*--------------------------------------------*/
function loadQuestions() {
	var questionHolder = [];
    var newQuestion;
    database.on('child_added', function(update) {
        var questionJSON = update.val();
        newQuestion = new Question({
            //id: generateNewID('questions'),
            id: 'question-filler',
            question: questionJSON['question'],
            answers: "["+questionJSON['correct']+", "+questionJSON['wa1']+", "+questionJSON['wa2']+", "+questionJSON['wa3']+"]"
        });
        questionHolder.push(newQuestion);
    });
    return questionHolder;
}



/*--------------------------------------------*/
/*---> Upload question to Firebase <----------*/
// ONE TIME push to update the questions on firebase
/*--------------------------------------------*/
function getData() {
    $.ajax({
        url: questionsLink,
        success: function(data){
            uploadFirebase(data);
        }
    });
}
// upload data to firebase
function uploadFirebase(data){
    var cells = data.feed.entry;
    rows = [];

    for (var i = 0; i < cells.length; i++){
        var rowObj = {};
        rowObj.timestamp = cells[i].title.$t;
        var rowCols = cells[i].content.$t.split(',');
        for (var j = 0; j < rowCols.length; j++){
            var keyVal = rowCols[j].split(':');
            rowObj[keyVal[0].trim()] = keyVal[1].trim();
        }
        rows.push(rowObj);
    }
    for (var i = 0; i < rows.length; i++) {
    	database.push({question: rows[i]['timestamp'], correct: rows[i]['correct'], wa1: rows[i]['wa1'], wa2: rows[i]['wa2'], wa3: rows[i]['wa3']});
    }
}

console.log('LOADED BACKEND');


/* Legacy code

$("#upload").click(function() { // If the user clicks on the input with the id="upload"
	var name = $("#nameInput").val();
	var text = $("#messageInput").val();
	if (name.length != 0 && text.length != 0) { // Don't upload if there's no information in the textboxes
		console.log(name.length);
		console.log(text.length);

		database.push({name: name, text: text}); // Push the data onto the database

	}else { // warns user of their empty textbox
		console.log("Please input values into the textbox");
	}
});

function displayUpdate(name, text) {
	$("<div/>").text(text).prepend($("<em/>").text(name+": ")).appendTo($("#messageDiv"));
	$("#messageDiv")[0].scrollTop = $("#messageDiv")[0].scrollHeight;
};

database.on("child_added", function(update) { // Get an update once the database has new data
	console.log("Callback function: New data has been added to the database");
	var message = update.val();
	displayUpdate(message.name, message.text);
});

*/
