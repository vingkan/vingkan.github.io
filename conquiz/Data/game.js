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
	var size = this.towers.length;
	var circle;
	var currentTower;
	//TEXTAREA OUTPUT
	var list = "towers";
	var output = document.getElementById('output-' + list);
	for(var i = 0; i < size; i++){
		currentTower = this.towers[i];
		circle = currentTower.getCircle()
		map.addObject(circle);
		currentTower.update();
		//TEXTAREA OUTPUT
		currentTower.value += currentTower + '\n';
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
