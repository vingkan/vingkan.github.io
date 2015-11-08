var nameList = [
	"Nick",
	"Vinesh",
	"Mohsin"
];

function generateRandomName(){
	var max = nameList.length;
	var min = 0;
	var random = Math.floor(Math.random() * (max - min)) + min;
	return nameList[random];
}

function generateNewID(objectType){
	var objectCounter = game.get(objectType + 's').length;
	var newID = objectType + objectCounter;
	return newID;
}

function Game(data){
	this.id = data['id'];
	if('secret_key' in data){
		this.secret_key = data['secret_key'];
	}
	else{
		this.secret_key = Math.random().toString(36).substring(7);
	}
	this.name = data['name'];
	this.players = [];
	this.towers = [];
	this.troops = [];
	this.questions = [];
	this.questionLength = 10;
	this.spawnRate = 10;
	this.mode = "lastmanstanding";
	this.rounds = 0;
	this.taskManager = {
		taskList: [],
		interval: 2000
	}
}

Game.prototype.get = function(attribute){
	return this[attribute];
}

Game.prototype.set = function(attribute, value){
	this[attribute] = value;
}

Game.prototype.update = function(){
	updateTowerbase(this.towers);
	var mapObjects = map.getObjects();
	var size = mapObjects.length;
	var towerCount = 0;
	for(var b = 0; b < size; b++){
		if(mapObjects[b] instanceof H.map.Circle){
			towerCount++;
		}
	}
	if(towerCount == 7){
		console.log(':) GAME IS READY!');
		openGame();
	}
	else{
		console.log(':( Only ' + towerCount + ' towers have been placed.');
	}
}

Game.prototype.push = function(list, object){
	this[list].push(object);
	this.update();
}

Game.prototype.getObjectById = function(list, id){
	var array = this[list];
	var response = null;
	var size = array.length;
	for(var i = 0; i < size; i++){
		if(array[i].get('id') === id){
			response = array[i];
			break;
		}
	}
	if(response != null){
		return response;
	}
}

Game.prototype.addTask = function(task){
	this.taskManager.taskList.push(task);
}


Game.prototype.printAllTowerCoordinates = function(){
	for(var t = 0; t < this.towers.length; t++){
		console.log(this.towers[t].id + ', ' + this.towers[t].getLat() + ', ' + this.towers[t].getLon());
	}
}