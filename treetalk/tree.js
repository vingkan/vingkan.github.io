var treeIDList = [];

function newTreeID(){
	var newID = "tree" + treeIDList.length;
	treeIDList.push(newID);
	return newID;
}

Tree.prototype.id = ""; //String
Tree.prototype.species = ""; //String
Tree.prototype.name = ""; //String
Tree.prototype.diameter = 0; //Integer
Tree.prototype.trunks = 0; //Integer
Tree.prototype.location = ""; //String
Tree.prototype.coordinates = {
	'latitude': 0.0,
	'longitude': 0.0
}; //Object of Doubles/Floats

function Tree(data){
	this.id = newTreeID();
	this.species = data['tree_species'] || this.species;
	this.name = data['common_name'] || this.name;
	this.diameter = parseInt(data['diameter_at_breast_height'], 10) || this.diameter;
	this.trunks = parseInt(data['number_of_trunks'], 10) || this.trunks;
	this.location = data['location_type'] || this.location;
	this.coordinates = {
		'latitude': parseFloat(data['location']['latitude']),
		'longitude': parseFloat(data['location']['longitude'])
	} || this.coordinates;
}

function cloudAlert(numberCleaned){
	document.getElementById('numberCloudsCleaned').innerHTML = numberCleaned;
	document.getElementById('cleanedCloudsAlert').style.height = '10vh';
	setTimeout(function(){
		document.getElementById('cleanedCloudsAlert').style.height = '0vh';
	}, 3000);
}

function absorb(sweepIndex){
	var cloudsCleaned = 0;
	var sweeper = $('#sweeper' + sweepIndex);
	for(var c = 0; c < cloudIDList.length; c++){
		if($('#' + cloudIDList[c])){
			var currentCloud = $('#' + cloudIDList[c]);
			if(collision(sweeper, currentCloud)){
				var domCloud = document.getElementById('cloud' + c);
				domCloud.style.backgroundImage = "url('style/cleanCloud.png')";
				cloudsCleaned++;
				/*var parent = document.getElementById(board.id + '-clouds');
				parent.removeChild(domCloud);*/
			}
		}
		else{
			console.log('error')
		}
	}
	if(cloudsCleaned > 0){
		cloudAlert(cloudsCleaned);
	}
}

Tree.prototype.toSweeperHTML = function(){
	var t = 0;
	var html = '';
	//html += '<div class="treeSlot">';
		html +='<button onclick="absorb(' + t + ');">';
		html += '<img class="speciesImage" src="style/trees/' + this.getCommonName(false) + '.png">'
		html += '</button>';
		html += '<div id="sweeper' + t + '" class="sweeper"></div>';
	//html += '</div>';
	return html;
}

function allowDrop(event){
	event.preventDefault();
}

function dragTree(event, treeID){
	event.dataTransfer.setData("text", treeID);
}

function dropTree(event){
	event.preventDefault();
	var treeID = event.dataTransfer.getData("text");
	var treeHTML = board.getTreeById(treeID).toSweeperHTML();
	document.getElementById(event.target.id).innerHTML += treeHTML;
	//event.target.appendChild(treeHTML);
	plantTree('You planted a new tree!');
	setTimeout(function(){
		instructionsAlert('Click on this tree to clean the air around it!', 3000);
	}, 2000);
}

function showTree(treeID){
	plantTree('You can plant this tree in an open site!')
}

function plantTree(message){
	document.getElementById('plantTreeEvent').innerHTML = message;
	document.getElementById('plantTreeAlert').style.height = '10vh';
	setTimeout(function(){
		document.getElementById('plantTreeAlert').style.height = '0vh';
	}, 2000);
}

Tree.prototype.toWindowHTML = function(){
	var html = '';
		html += '<li class="treeInfoWrapper" id="li-' + this.id + '" onclick="showTree(&#39;' + this.id + '&#39;);" draggable="true" ondragstart="dragTree(event, &#39;' + this.id + '&#39;);">'
			html += '<img class="speciesImage" src="style/trees/' + this.getCommonName(false) + '.png">'
			html += '<div class="treeInfo">' + this.getCommonName(true) + '<br><span class="coords">' + this.formatCoordinates() + '</span></div>'
		html += '</li>'
	return html;
}

Tree.prototype.getCommonName = function(formatted){
	var nameSplit = this.name.split(",");
	var commonName = nameSplit[0];
	if(formatted){
		commonName = commonName.charAt(0).toUpperCase() + commonName.substr(1);
	}
	return commonName;
}

Tree.prototype.formatCoordinates = function(){
	return '(' + this.coordinates.latitude.toFixed(3) + ', ' + this.coordinates.longitude.toFixed(3) + ')';
}

Tree.prototype.toString = function(){
	var plural = "";
	if(this.trunks > 1){
		plural = "s";
	}
	return this.diameter + "' "
		+ this.name + " (" + this.species + ") "
		+ "with " + this.trunks + " trunk" + plural + " "
		+ "at {" + this.coordinates.latitude.toFixed(3) + ", "
		+ this.coordinates.longitude.toFixed(3) + "}";
}