Car.prototype.name = "" //String
Car.prototype.color = "" //Color as String
Car.prototype.appearanceOptions = 36; //Body Type as Integer
Car.prototype.appearance = 1; //Body Type as Integer

function Car(name, color){
	this.name = name || "Car";
	this.color = color || "red";
	this.appearance = Math.round((Math.random() * (this.appearanceOptions - 1)) + 1);
}

Car.prototype.toHTML = function(){
	var html = '';
	html += '<div class="car" style="background-image:';
	html += 'url(style/cars/path' + (2192 + this.appearance) * 2 + '.png);">';
	html += '</div>';
	return html;
}