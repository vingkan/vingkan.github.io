Board.prototype.id = "" //String: parent div for board
Board.prototype.size = 400; //Pixels as Double
Board.prototype.roadSize = 40; //Pixels as Double
Board.prototype.roads = [] //Array of Roads
Board.prototype.trees = [] //Array of Trees
Board.prototype.clouds = 0 //Integer

function Board(id){
	this.id = id || "gameSpace";
	this.size = 400;
	this.roadSize = 40;
	this.roads = [];
	this.trees = [];
	this.clouds = 0;
}

Board.prototype.pollute = function(){
	var pollution = 0;
	pollution = 0 * this.roads.length;
	this.clouds += pollution;
}

Board.prototype.update = function(){
	this.pollute();
	for(var r = 0; r < this.roads.length; r++){
		this.roads[r].update(this.size, this.roadSize);
	}
}

Board.prototype.print = function(){
	this.update();
	var gameSpaceDiv = document.getElementById(this.id);
	gameSpaceDiv.innerHTML = this.toHTML();
	printed = true;
}

Board.prototype.toHTML = function(){
	html = '';
	html += '<div class="board">';
	var xOffSet = this.roadSize;
	var yOffSet = this.roadSize + (-1 * ((this.size - this.roadSize) / 2));
	var offsetInterval = this.roadSize * 3;
	for(var c = 0; c < this.clouds; c++){
		var xRandom = Math.random() * ((this.size) + (yOffSet / 4));
		var yRandom = Math.random() * ((this.size - this.roadSize));
		html += '<div class="cloud" ';
		html += 'style="margin-left:' + xRandom + 'px;';
		html += 'margin-top:' + yRandom + 'px;"></div>';
	}
	for(var r = 0; r < this.roads.length; r++){
		if(this.roads[r].vertical){
			html += this.roads[r].toHTML(yOffSet.toString() + 'px');
			yOffSet += offsetInterval;
		}
		else{
			html += this.roads[r].toHTML(xOffSet.toString() + 'px');
			xOffSet += offsetInterval;
		}
	}
	html += '</div>';
	return html;
}

Board.prototype.addRoads = function(roadsArray){
	console.log("a")
	for(var r = 0; r < roadsArray.length; r++){
		this.roads.push(roadsArray[r]);
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