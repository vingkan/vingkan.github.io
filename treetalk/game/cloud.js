var cloudIDList = [];

function newCloudID(){
	var newID = "cloud" + cloudIDList.length;
	cloudIDList.push(newID);
	return newID;
}

Cloud.prototype.id = ""; //String
Cloud.prototype.xCoord = 0; //Double
Cloud.prototype.yCoord = 0; //Double
Cloud.prototype.text = 'ins'; //String
Cloud.prototype.boardSize = 100; //Double
Cloud.prototype.deviance = 0; //Double

function Cloud(x, y, boardID, text){
	this.id = newCloudID();
	this.xCoord = x || 0;
	this.yCoord = y || 0;
	this.text = text || 'null';
	this.boardSize = board.size;
	this.deviance = 0;
	//console.log('new cloud: ' + this.id + " at (" + this.xCoord + ", " + this.yCoord + "):");
	if(printed){
		document.getElementById(boardID + '-clouds').innerHTML += this.toHTML();
		board.clouds.push(this);
	}
}

/*function checkNewPosition(initial, increment, limit){
	var 
	if((initial + increment) > limit){

	}
}*/

Cloud.prototype.update = function(roadSize, newBoardSize){
	var exists = true;
	var oldBoardSize = this.boardSize;
	if(printed){
		var xNew = (this.xCoord / oldBoardSize) * newBoardSize;
		var yNew = (this.yCoord / oldBoardSize) * newBoardSize;
		var xRand = (Math.random() - 0.5) * (roadSize / 2);
		var yRand = (Math.random() - 0.5) * (roadSize / 2);
		this.deviance += (xRand + yRand);
		if(Math.abs(this.deviance) > (roadSize / 2)){
			xRand = 0 * xRand;
			yRand = 0 * yRand;
		}
		this.xCoord = xNew + xRand;
		this.yCoord = yNew + yRand;
		if(document.getElementById(this.id)){
			document.getElementById(this.id).style.marginLeft = this.xCoord + 'px';
			document.getElementById(this.id).style.marginTop = this.yCoord + 'px';
		}
		else{
			exists = false;
			console.log('cloud.update() ' + this.id + " DNE")
		}
	}
	this.boardSize = newBoardSize;
	return exists;
}

Cloud.prototype.toHTML = function(){
	var html = '';
	html += '<div id="' + this.id + '" class="cloud" style="';
	html += 'margin-left:' + this.xCoord + 'px;margin-top:' + this.yCoord + 'px;">';
	html += this.text + '</div>';
	return html;
}

Cloud.prototype.toString = function(){
	return this.id + " at {" + this.xCoord + ", " + this.yCoord + "}";
}