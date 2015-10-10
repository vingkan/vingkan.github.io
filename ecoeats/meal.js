function loadMeals(displayPast){
	var printAll = displayPast || false;
	var upcomingMeals = document.getElementById('upcomingMeals');
	if(meals.length > 0){
		meals.sort(function(a, b){
			return sortMealsByTimestamp(a, b);
		});
		upcomingMeals.innerHTML = "";
		for(var m = 0; m < meals.length; m++){
			if(meals[m].timestamp > new Date().getTime() || printAll){
				upcomingMeals.innerHTML += meals[m].toHTML();
			}
		}
	}
	else{
		upcomingMeals.innerHTML += '<p>No meals are currently listed. Host your own!</p>';
	}
}

function loadMealOptions(){
	var mealSelector = document.getElementById('mealSelector');
	if(meals.length > 0){
		meals.sort(function(a, b){
			return sortMealsByTimestamp(a, b);
		});
		mealSelector.innerHTML = '<option value="newMeal">Add: New Meal</option>';
		for(var m = 0; m < meals.length; m++){
			if(meals[m].timestamp > new Date().getTime()){
				mealSelector.innerHTML += meals[m].toOption();
			}
		}
	}
}

function loadEditForm(){
	var editForm = document.getElementById('editForm');
		editForm.style.display = 'block';
	var infoSpacer = document.getElementById('infoSpacer');
		infoSpacer.style.display = 'none';
	var mealSelector = document.getElementById('mealSelector');
		var nameField = document.getElementById('new-name');
		var chefField = document.getElementById('new-chef');
		var priceField = document.getElementById('new-price');
		var capacityField = document.getElementById('new-capacity');
		var locationField = document.getElementById('new-location');
		var dateField = document.getElementById('new-date');
		var timeField = document.getElementById('new-time');
		var imgField = document.getElementById('new-img');
	if(mealSelector.value != 'newMeal'){
		for(var m = 0; m < meals.length; m++){
			if(meals[m].id == mealSelector.value){
				nameField.value = meals[m].name;
				chefField.value = meals[m].chef;
				priceField.value = meals[m].price;
				capacityField.value = meals[m].capacity;
				locationField.value = meals[m].location;
				dateField.value = moment(meals[m].timestamp).format('YYYY-MM-DD');
				timeField.value = moment(meals[m].timestamp).format('HH:MM');
				imgField.value = meals[m].img;
			}
		}
	}
	else{
		resetMealForm();
	}
}

function getNewMealID(){
	return 'meal-' + (meals.length + 1);
}

function updateMeal(){
	var mealSelector = document.getElementById('mealSelector');
	//GET FIELDS
		var nameField = document.getElementById('new-name');
		var chefField = document.getElementById('new-chef');
		var priceField = document.getElementById('new-price');
		var capacityField = document.getElementById('new-capacity');
		var locationField = document.getElementById('new-location');
		var dateField = document.getElementById('new-date');
		var timeField = document.getElementById('new-time');
		var imgField = document.getElementById('new-img');
	//PREPARE SPECIAL VALUES FOR BOTH NEW AND EXISTING DATA
	var dateValue = new Date(dateField.value);
	var momentObject = moment(dateValue);
		var hoursValue = timeField.value.substr(0,2);
		var minutesValue = timeField.value.substr(3,2);
		momentObject.hours(hoursValue);
		momentObject.minutes(minutesValue);
	var eventDate = momentObject.toDate();
	if(mealSelector.value != 'newMeal'){
		mealDatabase.child(mealSelector.value).update({
			name: nameField.value,
			id: mealSelector.value,
			chef: chefField.value,
			location: locationField.value,
			timestamp: eventDate.getTime(),
			img: imgField.value,
			capacity: capacityField.value,
			price: priceField.value
		});
	}
	else{
		var newID = getNewMealID();
		mealDatabase.push({
			name: nameField.value,
			id: newID,
			chef: chefField.value,
			location: locationField.value,
			timestamp: eventDate.getTime(),
			img: imgField.value,
			capacity: capacityField.value,
			price: priceField.value
		});
	}
	resetMealForm();
	loadMealOptions();
	var editForm = document.getElementById('editForm');
		editForm.style.display = 'none';
	var infoSpacer = document.getElementById('infoSpacer');
		infoSpacer.style.display = 'block';
}

function deleteEntry(){
	var mealSelector = document.getElementById('mealSelector');
	mealDatabase.child(mealSelector.value).remove();
	loadMealOptions();
}

function resetMealForm(){
	var mealSelector = document.getElementById('mealSelector');
	var nameField = document.getElementById('new-name');
	var chefField = document.getElementById('new-chef');
	var priceField = document.getElementById('new-price');
	var capacityField = document.getElementById('new-capacity');
	var locationField = document.getElementById('new-location');
	var dateField = document.getElementById('new-date');
	var timeField = document.getElementById('new-time');
	var imgField = document.getElementById('new-img');
	mealSelector.value = 'newMeal';
	nameField.value = null;
	chefField.value = null;
	priceField.value = null;
	capacityField.value = null;
	locationField.value = null;
	dateField.value = null;
	timeField.value = null;
	imgField.value = null;
}

function Meal(snapshot){
	this.name = snapshot.name;
	this.id = snapshot.id;
	this.chef = snapshot.chef;
	this.timestamp = snapshot.timestamp;
	this.location = snapshot.location;
	this.img = snapshot.img;
	this.price = snapshot.price;
	this.capacity = snapshot.capacity;
}

Meal.prototype.toString = function(){
	return this.name + " by " + this.chef + ": " + moment(this.timestamp).calendar() + " for " + this.capacity + " people at " + money(this.price) + " each.";
}

Meal.prototype.toHTML = function(){
	var html = '';
	//html += '<div class="mealPreview" style="background-image: url(&#39;style/meals/' + this.img + '&#39;);">';
	html += '<div class="mealPreview" style="background-image: url(&#39;' + this.img + '&#39;);">';
		html += '<div class="info">';
			html += '<div class="mealPay">';
			html += '<p>Join us at ' + this.location + ' ' + moment(this.timestamp).calendar() + ' for this meal.</p>';
			html += this.getHTMLPayButton();
			html += '</div>';
			html += '<div class="bubble price">$' + this.price + ' per person</div>';
			html += '<div class="bubble capacity">' + this.capacity + ' spots left </div>';
			html += '<div class="bubble date">' + moment(this.timestamp).format('MM/DD h:mm A') + '</div>';
		html += '</div>';
		html += '<div class="mealTitle">';
			html += '<h2>' + this.name + '</h2>';
			html += '<h3>' + this.chef + '</h3>';
		html += '</div>';
	html += '</div>';
	return html;
}

Meal.prototype.getHTMLPayButton = function(){
	/*CODE FOR DWOLLA BUTTON:
		var button = '';
			button += '<a class="d-btn d-btn-simple" data-key="DZ4cNXNsCrG4xbTyKPGqt4HEasxWBqk1c6pClzTSps5HU4bbDV" data-redirect="http://ecoeats.tk/" data-label="Pay and Join" data-name="EcoEats Meal: ' + this.name + '" data-description="..." data-amount="' + this.price + '" data-guest-checkout="true" data-type="simple">';
				button += '<span class="d-btn-text">Pay and Join</span>';
				button += '<span class="d-btn-icon"></span>';
			button += '</a>';
		return button;*/
	var button = '';
		button += '<form class="paypalForm" method="post" action="https://www.paypal.com/cgi-bin/webscr" class="paypal-button" target="_top">';
			button += '<div class="hide" id="errorBox"></div>';
			button += '<input type="hidden" name="button" value="buynow">';
			button += '<input type="hidden" name="item_name" value="EcoEats Meal: ' + this.name + '">';
			button += '<input type="hidden" name="amount" value="' + this.price + '">';
			button += '<input type="hidden" name="cmd" value="_xclick">';
			button += '<input type="hidden" name="business" value="QWZMVF8ZHS2P4">';
			button += '<input type="hidden" name="bn" value="JavaScriptButton_buynow">';
			button += '<input type="hidden" name="env" value="www">';
			button += '<button type="submit" id="' + this.id + '" onclick="togglePayButton(&#39;' + this.id + '&#39;);" class="paypal-button large">Pay Now</button>';
		button += '</form>';
	return button;
}

Meal.prototype.toOption = function(){
	var html = '';
		html += '<option value="' + this.id + '">Edit: ' + this.name + '</option>';
	return html;
}

function money(value){
	return "$" + value.toFixed(2);
}

function sortMealsByTimestamp(meal1, meal2){
	return meal1.timestamp - meal2.timestamp;
}

/*function viewMeal(id){
	alert(id + "");
}*/