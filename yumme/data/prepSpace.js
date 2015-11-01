PrepSpace.prototype.name = ""; //String
PrepSpace.prototype.id = ""; //String
PrepSpace.prototype.image = ""; //Path

function PrepSpace(config){
	this.name = config['name'];
	this.id = config['id'];
	this.image = "'" + config['image'] + "'";
}

PrepSpace.prototype.toHTML = function(){
	var html = '';
	html += '<div class="location" ';
	html += 'id="' + this.id + '" ';
	html += 'style="background-image: url(' + this.image + ');"';
	html += '>';
	html += '<span class="label">' + this.name + '</span>';
	html += '<div class="container" id="' + this.id + '-container"></div>';
	html += '</div>';
	return html;
}

PrepSpace.prototype.addToLocations = function(){
	document.getElementById('locationSpace').innerHTML += this.toHTML();
	//registerDroppable(this.id + '-container');
}

PrepSpace.prototype.addUtensil = function(utensil){
	var prepSpace = document.getElementById(this.id);
	prepSpace.innerHTML += utensil.toHTML();
	if(utensil.draggable){
		registerDraggable(utensil.id);
	}
	if(utensil.droppable){
		registerDroppable(utensil.id);
	}
}