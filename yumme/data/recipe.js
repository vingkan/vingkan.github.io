var recipes = [];

function getRecipe(id){
	var size = recipes.length;
	var response = null;
	for(var i = 0; i < size; i++){
		if(recipes[i].id == id){
			response = recipes[i];
		}
	}
	if(response != null){
		return response;
	}
	else{
		alert('ERROR: A recipe with the id: [' + id + '] was not found.');
	}
}

Recipe.prototype.name = ""; //String
Recipe.prototype.id = ""; //String
Recipe.prototype.ingredients = []; //Array of Ingredient Objects
Recipe.prototype.instructions = []; //Array of Strings

function Recipe(config){
	this.name = config['name'];
	this.id = config['id'];
	this.ingredients = config['ingredients']
	this.instructions = config['instructions'];
	this.addToBank();
}

Recipe.prototype.toHTML = function(){
	var html = "";
	html += '<h3>' + this.name + '</h3>';
	html += '<h4>ingredients</h4>';
	html += '<ul>';
	var size = this.ingredients.length;
	for(var i = 0; i < size; i++){
		html += '<li>' + this.ingredients[i].name + '</li>';
	}
	html += '</ul>';
	html += '<h4>instructions</h4>';
	html += '<ol>';
	size = this.instructions.length;
	for(var i = 0; i < size; i++){
		html += '<li>' + this.instructions[i] + '</li>';
	}
	html += '</ol>';
	return html;
}

Recipe.prototype.toResultHTML = function(){
	var html = '<div class="recipe-result">';
	html += '<button onclick="selectRecipe(&quot;' + this.id + '&quot;);">+</button>';
	html += this.name;
	html += '</div>';
	return html;
}

function selectRecipe(recipeID){
	var recipeContainer = document.getElementById('container-recipe');
	var selectedRecipe = getRecipe(recipeID);
	recipeContainer.innerHTML = selectedRecipe.toHTML();
	toggleSideBar('recipe');
	var size = this.ingredients.length;
	for(var i = 0; i < size; i++){
		addToCart(this.ingredients[i].id);
	}
}

Recipe.prototype.getInstructionsAsBlob = function(){
	var blob = "";
	var size = this.instructions.length;
	for(var i = 0; i < size; i++){
		blob += this.instructions[i] + '\n';
	}
	return blob;
}

/*--------------------------------------------*/
/*---> SEARCHING <----------------------------*/
/*--------------------------------------------*/

var recipesBank = lunr(function(){
	this.field('title' , {boost: 10});
	this.field('body');
	this.field('object');
	this.ref('id');
});

function searchRecipes(){
	var query = document.getElementById('search-recipes').value;
	var results = recipesBank.search(query);
	var size = results.length;
	var output = document.getElementById('cookbookResults');
		output.innerHTML = "";
	if(size > 0){
		for(var r = 0; r < size; r++){
			var recipeResult = getRecipe(results[r].ref);
			output.innerHTML += recipeResult.toResultHTML();
		}
	}
	else{
		output.innerHTML = '<p>No Results Found</p>';
	}
}

Recipe.prototype.addToBank = function(){
	recipes.push(this);
	recipesBank.add({
		id: this.id,
		title: this.name,
		body: this.getInstructionsAsBlob(),
		object: this
	});
}