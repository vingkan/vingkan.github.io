Road.prototype.name = ""; //String
Road.prototype.vertical = false; //Boolean
Road.prototype.cars = []; //Array of Cars

function Road(name, vertical, cars){
	this.name = name;
	this.vertical = vertical || false;
	this.cars = cars || [];
}

Road.prototype.toHTML = function(offset){
	html = '';
	var verticalModifier = '" ';
	var marginTag = "margin-top";
	var marginSize = offset;
	if(this.vertical){
		verticalModifier = ' vertical" ';
		marginTag = "margin-left";
	}
	html += '<div class="road' + verticalModifier;
	html += 'style="' + marginTag + ':' + marginSize + ';"';
	html += '>';
	html += '<p class="roadName">' + this.name + '</p>';
	for(var c = 0; c < this.cars.length; c++){
		html += this.cars[c].toHTML();
	}
	html += '</div>';
	return html;
}