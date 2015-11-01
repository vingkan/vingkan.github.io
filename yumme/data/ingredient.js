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
	this.addToBank();
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

Ingredient.prototype.toResultHTML = function(){
	var html = '';
	html += '<div class="ingredient" ';
	//html += 'id="' + this.id + '" ';
	html += 'style="background-image: url(' + this.image + ');"';
	html += '>';
	html += '<button class="buy" onclick="addToCart(' + this.id + ');">+</button>';
	html += '<span class="label">' + this.name + '</span>';
	html += '</div>';
	return html;
}
/*--------------------------------------------*/
/*---> SEARCHING <----------------------------*/
/*--------------------------------------------*/

var ingredientsBank = lunr(function(){
	this.field('title', {boost: 10});
	this.field('body');
	this.field('object');
	this.ref('id');
});

function searchIngredients(){
	var query = document.getElementById('search-ingredients').value;
	var results = ingredientsBank.search(query);
	var size = results.length;
	var output = document.getElementById('shoppingResults');
		output.innerHTML = "";
	if(size > 0){
		for(var r = 0; r < size; r++){
			var ingredientResult = getIngredient(results[r].ref)
			console.log(results[r]);
			console.log(ingredientResult);
			output.innerHTML += ingredientResult.toResultHTML();
		}
	}
	else{
		output.innerHTML = '<p>No Results Found</p>';
	}
}

Ingredient.prototype.addToBank = function(){
	ingredientsBank.add({
		id: this.id,
		title: this.name,
		body: this.name,
		object: this
	});
}