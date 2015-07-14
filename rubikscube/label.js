/*
* Constructor for Label class
* Represents a single color on a part of a cube. Could be configured for labels other than colors...
*/
function Label(color){
	this.color = color || null;
}

/*
* Returns the first letter of the label's color, '-' if blank
*/
Label.prototype.toChar = function(){
	var colorString = this.color + "";
	var letter = "";
	if(colorString == "blank"){
		letter = '-';
	}
	else{
		letter = colorString.charAt(0).toUpperCase();
	}
	return letter;
}

/*
* Returns HTML representation of label, div of class "label"
*/
Label.prototype.toHTML = function(type, cubeView){
	var html = '';
	if(cubeView){
		html = '<div class="label" style="background: ' + this.color + ';">' + this.toChar() + '<div class="partType">' + type + '</div></div>';
	}
	else{
		html = '<div class="label" style="background: ' + this.color + ';">' + this.toChar() + '</div>';
	}
	return html;
}