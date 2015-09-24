function loadMeals(){
	var upcomingMeals = document.getElementById('upcomingMeals');
	if(meals.length > 0){
		meals.sort(function(a, b){
			return sortMealsByTimestamp(a, b);
		});
		upcomingMeals.innerHTML = "";
		for(var m = 0; m < meals.length; m++){
			upcomingMeals.innerHTML += meals[m].toHTML();
		}
	}
	else{
		upcomingMeals.innerHTML += '<p>No meals are currently listed. Host your own!</p>';
	}
}

function Meal(snapshot){
	this.name = snapshot.name;
	this.id = snapshot.id;
	this.chef = snapshot.chef;
	this.timestamp = snapshot.timestamp;
	this.img = snapshot.img;
	this.price = snapshot.price;
	this.capacity = snapshot.capacity;
}

Meal.prototype.toString = function(){
	return this.name + " by " + this.chef + ": " + moment(this.timestamp).calendar() + " for " + this.capacity + " people at " + money(this.price) + " each.";
}

Meal.prototype.toHTML = function(){
	var html = '';
	html += '<div class="mealPreview" onclick="viewMeal(&#39;' + this.id + '&#39;)" style="background-image: url(&#39;style/meals/' + this.img + '&#39;);">';
		html += '<div class="info">';
			html += '<div class="bubble price">$' + this.price + '</div>';
			html += '<div class="bubble capacity">' + this.capacity + '</div>';
			html += '<div class="bubble date">' + moment(this.timestamp).format('MM/DD h:mm A') + '</div>';
		html += '</div>';
		html += '<div class="mealTitle">';
			html += '<h2>' + this.name + '</h2>';
			html += '<h3>' + this.chef + '</h3>';
		html += '</div>';
	html += '</div>';
	return html;
}

function money(value){
	return "$" + value.toFixed(2);
}

function sortMealsByTimestamp(meal1, meal2){
	return meal1.timestamp - meal2.timestamp;
}

function viewMeal(id){
	alert(id + "");
}