var printed = false;
var learning = true;

Board.prototype.id = "" //String: parent div for board
Board.prototype.size = 400; //Pixels as Double
Board.prototype.roadSize = 40; //Pixels as Double
Board.prototype.roads = [] //Array of Roads
Board.prototype.trees = [] //Array of Trees
Board.prototype.clouds = [] //Array of Clouds
Board.prototype.cloudTreshold = 50; //Integer
Board.prototype.selectedTree = null; //String
Board.prototype.planting = false; //Boolean

function Board(id){
	this.id = id || "gameSpace";
	this.size = 400;
	this.roadSize = 40;
	this.roads = [];
	this.trees = [];
	this.clouds = [];
	this.cloudTreshold = 100;
}

Board.prototype.getPollutionPercentage = function(){
	var cleanClouds = 0;
	for(var c = 0; c < this.clouds.length; c++){
		var cloudDOM = document.getElementById(this.clouds[c].id);
		if(cloudDOM.style.backgroundImage.length > 6){
			cleanClouds++;
		}
	}
	var fraction = cleanClouds / this.clouds.length;
	var percentOutput = (fraction * 100).toFixed(2) + "%";
	alert(percentOutput);
}

Board.prototype.pollute = function(){
	if(printed && this.clouds.length < this.cloudTreshold){
		for(var r = 0; r < this.roads.length; r++){
			for(var c = 0; c < this.roads[r].cars.length; c++){
				if(this.roads[r].cars[c].isPolluting()){
					//console.log(this.clouds.length)
					this.roads[r].cars[c].pollute({
						'cloudID': this.id,
						'verticalRoad': this.roads[r].vertical,
						'roadOffset': this.roads[r].offset
					});
				}
			}
		}
	}
}

Board.prototype.initialPollution = function(){
	for(var p = 0; p < this.cloudTreshold; p++){
		var xRand = this.size * ((Math.random() * 0.75) + (0.10));
		var yRand = this.size * ((Math.random() * 0.75) + (0.10));
		new Cloud(xRand, yRand, this.id, ' ');
	}
}

Board.prototype.update = function(){
	this.pollute();
	for(var r = 0; r < this.roads.length; r++){
		this.roads[r].update(this.size, this.roadSize);
	}
	for(var c = 0; c < this.clouds.length; c++){
		var cloudExists = true;
		cloudExists = this.clouds[c].update(this.roadSize, this.size);
		if(!cloudExists){
			console.log('board.update() ' + c + ' Cloud DNE');
		}
	}
}

Board.prototype.print = function(){
	var gameSpaceDiv = document.getElementById(this.id);
	gameSpaceDiv.innerHTML = this.toHTML();
	printed = true;
	this.update();
}

Board.prototype.toHTML = function(){
	console.log('----printing game board, clouds#: ' + this.clouds.length)
	html = '';
	html += '<div class="board">';
	var xOffSet = this.roadSize;
	var yOffSet = this.roadSize + (-1 * ((this.size - this.roadSize) / 2));
	var offsetInterval = this.roadSize * 3;
	html += '<div id="' + this.id + '-trees" class="treeSpace">';
	for(var t = 0; t < 9; t++){
		html += '<div class="treeSlot" id="treeSlot' + t + '" ';
		html += 'onclick="plantTree(' + t + ');" ';
		html += 'ondrop="dropTree(event);" ondragover="allowDrop(event);">';
		//html += '<button onclick="absorb(' + t + ');">O</button><div id="sweeper' + t + '" class="sweeper"></div>';
		html += '</div>';
	}
	html += '</div>';
	html += '<div id="' + this.id + '-clouds" class="cloudSpace">';
	for(var c = 0; c < this.clouds.length; c++){
		html += this.clouds[c].toHTML();
	}
	html += '</div>';
	for(var r = 0; r < this.roads.length; r++){
		if(this.roads[r].vertical){
			html += this.roads[r].toHTML(yOffSet);
			yOffSet += offsetInterval;
		}
		else{
			html += this.roads[r].toHTML(xOffSet);
			xOffSet += offsetInterval;
		}
	}
	html += '</div>';
	return html;
}

Board.prototype.addRoads = function(roadsArray){
	for(var r = 0; r < roadsArray.length; r++){
		this.roads.push(roadsArray[r]);
	}
}

Board.prototype.addTrees = function(treesArray){
	for(var t = 0; t < treesArray.length; t++){
		this.trees.push(treesArray[t]);
		$('#li-' + treesArray[t].id).draggable();
	}
}

Board.prototype.getTreeById = function(treeID){
	var response = null;
	for(var t = 0; t < this.trees.length; t++){
		if(this.trees[t].id == treeID){
			response = this.trees[t];
			break;
		}
	}
	if(response != null){
		return response;
	}
}

Board.prototype.getAllCars = function(){
	var allCars = [];
	for(var r = 0; r < this.roads.length; r++){
		for(var c = 0; c < this.roads[r].cars.length; c++){
			allCars.push(this.roads[r].cars[c]);
		}
	}
	return allCars;
}

Board.prototype.getCarById = function(carID){
	var response = null;
	var carsArray = this.getAllCars();
	for(var c = 0; c < carsArray.length; c++){
		if(carsArray[c].id == carID){
			response = carsArray[c];
			break;
		}
	}
	if(response != null){
		return response;
	}
}