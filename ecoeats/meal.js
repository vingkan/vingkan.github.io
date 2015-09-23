function loadMeals(){
	var upcomingMeals = document.getElementById('upcomingMeals');
	if(meals.length > 0){
		upcomingMeals.innerHTML = "";
		for(var m = 0; m < meals.length; m++){
			upcomingMeals.innerHTML += '<p>' + meals[m] + '</p>';
		}
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

function money(value){
	return "$" + value.toFixed(2);
}