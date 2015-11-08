function initGame(){
	game = new Game({
		id: 'game0',
		name: "Sample Game"
	});
	game.questions = loadQuestions();
	createTowerPresets();
}

function joinGame(){
	console.log('before1')
	game = getGame();
	console.log('after1')
	/*game.questions = loadQuestions();
	game.troops = loadTroops();
	game.players = loadPlayers();
	game.towers = loadTowers();*/
}

var mapClickCallback = function(coordinates){
	console.log('no function event set yet');
};

var focusObject;

function setFocusObject(list, objectID){
	focusObject = game.getObjectById(list, objectID);
	$('#' + objectID).removeClass('preset');
	$('#' + objectID).addClass('selected');
	openMenu();
	publicLog('Click on spot on the map to place the tower at.');
	mapClickCallback = function(coordinates){
		focusObject.coordinate.latitude = coordinates.lat;
		focusObject.coordinate.longitude = coordinates.lng;
			circle = focusObject.getCircle();
			map.addObject(circle);
		focusObject.set('placed', true);
		focusObject = null;
		mapClickCallback = null;
		$('#' + objectID).removeClass('selected');
		$('#' + objectID).addClass('used');
		game.update();
		if(!checkGameReadyState()){
			openMenu();
			toggleMenu('towers');
		}
		else{
			openMenu();
			toggleMenu('gameStart')
		}
	}
}

//DATA
/*
* Assign event handler to map
* When map is clicked, return the lat and lon coordinates
* plantTowerOnMap is one callback
*/
/*mapClickCallback = function(coordinates){
	plantTowerOnMap(coordinates);
}*/

function createTowerPresets(){
	var sizes = [5, 5, 10, 10, 10, 15, 15];
	var presets = sizes.length;
	var tower;
	for(var s = 0; s < presets; s++){
		tower = plantTowerOnMap(
			{
				lat: 0,
				lng: 0
			},
			sizes[s]
		);
		var towerPresets = document.getElementById('preset-towers');
		towerPresets.innerHTML += tower.toPresetHTML();
	}
}

//FRONTEND
/*
* Open selector dialog for creator user to select radius size
*/
/*function getTowerRadius(size){
	var radius = 0;
	switch(size){
		case 'small':
			radius = 5;
			break;
		case 'medium':
			radius = 10;
			break;
		case 'big':
			radius = 15;
			break;
		default:
			console.log('TOWER TYPE ERROR');
	}
	return radius;
}*/

//APPLICATION
/*
* Params: coordinates: lat/lon pair
* Return: void, creates new Tower object and adds it to Game
*/
function plantTowerOnMap(coordinates, towerRadius){
	/*var input = prompt("Enter a pair of comma-separated coordinates for a Tower:");
	var coords = input.split(",");
	var coordinates = {
		latitude: coords[0],
		longitude: coords[1]
	}*/
	var tower = new Tower({
		id: generateNewID('towers'),
		name: "PRESET",
		latitude: coordinates.lat,
		longitude: coordinates.lng,
		size: towerRadius,
		player: null,
		troops: null
	});
	game.push('towers', tower);
	return tower;
}