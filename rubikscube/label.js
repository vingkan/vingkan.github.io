var uniqueLabelId = [];

/*
* Constructor for Label class
* Represents a single color on a part of a cube. Could be configured for labels other than colors...
*/
function Label(color){
	this.color = color || null;
	this.id = "l-" + uniqueLabelId.length;
		uniqueLabelId.push(this.id);
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
		html = '<div class="label" style="background: ' + this.color + ';" onclick="changeLabel(' + '&#39;' + this.id + '&#39;' + ');">' + this.toChar() + '</div>';
	}
	return html;
}

function setColor(color){
	var selectedColor = document.getElementById('selectedColor');
		selectedColor.value = color;
}

function changeLabel(labelId){
	var selectedColor = document.getElementById('selectedColor');
	for(var p = 0; p < cube.parts.length; p++){
		for(var i = 0; i < cube.parts[p].getAllLabels().length; i++){
			if(cube.parts[p].getAllLabels()[i].id == labelId){
				cube.parts[p].getAllLabels()[i].color = selectedColor.value;
				break;
			}
		}
	}
	cube.draw();
}