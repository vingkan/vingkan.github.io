Utensil.prototype.name = ""; //String
Utensil.prototype.id = ""; //String
Utensil.prototype.image = ""; //Path

function Utensil(config){
	this.name = config['name'];
	this.id = config['id'];
	this.image = config['image'];
}