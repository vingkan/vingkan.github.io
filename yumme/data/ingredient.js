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
		alert('ERROR: An ingredient with the id: [' + id + '] was not found.');
	}
}

Ingredient.prototype.name = ""; //String
Ingredient.prototype.id = ""; //String
Ingredient.prototype.image = ""; //Path

function Ingredient(config){
	this.name = config['name'];
	this.id = config['id'];
	this.image = config['image'];
	this.squirt = config['squirt'];
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
	html += '<button class="buy" onclick="addToCart(&quot;' + this.id + '&quot;);">+</button>';
	html += '<span class="label">' + this.name + '</span>';
	html += '</div>';
	return html;
}

Ingredient.prototype.toSquirt = function(){
	var squirt = new Howl({
		urls: ['style/sound/squirt.mp3']
	}).play();
	setTimeout(function(){
		squirt.stop();
	}, 2000);
	return '<div class="squirt" style="background: ' + this.squirt + ';"></div>';
}

function addToCart(ingredientID){
	var targetIngredient = getIngredient(ingredientID);
	//var cartContainer = document.getElementById('container-cart');
	//cartContainer.innerHTML += targetIngredient.toHTML();
	//toggleSideBar('cart');
	var ingredientsTable = document.getElementById('ingredientsTable-container');
	ingredientsTable.innerHTML += targetIngredient.toHTML();
	registerDraggable(ingredientID);
	closeAllSideBars();
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
			var ingredientResult = getIngredient(results[r].ref);
			/*console.log(results[r]);
			console.log(ingredientResult);*/
			output.innerHTML += ingredientResult.toResultHTML();
		}
	}
	else{
		output.innerHTML = '<p>No Results Found</p>';
	}
}

Ingredient.prototype.addToBank = function(){
	ingredients.push(this);
	ingredientsBank.add({
		id: this.id,
		title: this.name,
		body: this.name,
		object: this
	});
}