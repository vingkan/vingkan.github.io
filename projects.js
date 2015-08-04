function Swatch(name, hex){
	this.name = name;
	this.hex = hex;
}

function Project(name, organization, date, color, current, description, notes){
	this.name = name;
	this.organization = organization;
	this.date = date;
	this.color = color;
	this.current = current || false;
	this.description = description || ""
	this.notes = notes || [];
}

Project.prototype.getColor = function(){
	var response = '#000000';
	for(var n = 0; n < colorSwatch.length; n++){
		if(this.color == colorSwatch[n].name){
			response = colorSwatch[n].hex;
		}
	}
	return response;
}

Project.prototype.toHTML = function(idNumber){
	var backgroundTile = "background: url('style/" + this.color + ".png');"
	var status = 'Past';
		if(this.current){
			status = 'Current';
		}
	var html = ""
		html += '<div class="projectPane" onclick="toggle(' + idNumber + ');" style="' + backgroundTile + '">'
			html += '<div class="container">'
				html += '<div class="projectMarker" style="background: ' + this.getColor() + ';">' + status + '</div>'
				html += '<h2>' + this.name + '</h2>'
				html += '<h3 id="date' + idNumber + '">' + this.date + ', ' + this.organization + '</h3>'
				html += '<p>' + this.description + '</p>'
				html += '<ul id="ul' + idNumber + '">'
				for(var n = 0; n < this.notes.length; n++){
					html += '<li>' + this.notes[n] + '</li>'
				}
				html += '</ul>'
			html += '</div>'
		html += '</div>'
	return html;
}