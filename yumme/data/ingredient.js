var ingredients = [];

function getIngredient(id){
	var size = ingredients.length;
	var response = null;
	for(var i = 0; i < size; i++){
		if(ingredients[i].id == id){
			response = ingredients[i];
		}
	}
	if(response != null){
		return response;
	}
	else{
		console.log('ERROR: An ingredient with the id: [' + id + '] was not found.');
	}
}

Ingredient.prototype.name = ""; //String
Ingredient.prototype.id = ""; //String
Ingredient.prototype.image = ""; //Path

function Ingredient(config){
	this.name = config['name'];
	this.id = config['id'];
	this.image = config['image'];
	ingredients.push(this);
}

Ingredient.prototype.toHTML = function(){
	var html = '';
	html += '<div class="ingredient" ';
	html += 'id="' + this.id + '" ';
	html += 'style="background-image: url(' + this.image + ');"';
	html += '>';
	html += '<span class="label">' + this.name + '</span>';
	html += '</div>';
	return html;
}
