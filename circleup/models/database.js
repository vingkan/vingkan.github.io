function getUsers(){
	var users = [];
	var existingUser = false;
	var userDatabase = new Firebase('https://circleup.firebaseio.com/users');
	userDatabase.once('value', function(snapshot){
		snapshot.forEach(function(childSnapshot){
			var key = childSnapshot.key();
			var childData = childSnapshot.val();
			var user = new User(childData);
			user.id = key;
			if(user.email.toLowerCase() === userLocation.email.toLowerCase()){
				userLocation.id = key;
				console.log('User Key is: ' + key);
				existingUser = true;
				user.setGeolocation(userLocation.coordinates);
				updateUser(user, userLocation.coordinates);
			}
			users.push(user);
		});
		if(!existingUser){
			toggleWindow('newUser');
		}
		else{
			//Better place to put this
			loadingSequence();
			initGoogleMap(users);
		}
	});
}

function addUsers(userArray){
	var userDatabase = new Firebase('https://circleup.firebaseio.com/users');
	for(var u = 0; u < userArray.length; u++){
		var current = userArray[u];
		userDatabase.push({
			id: current.id,
			name: current.name,
			email: current.email,
			latitude: current.getLat(),
			longitude: current.getLon(),
			accuracy: current.getAccuracy(),
			circles: JSON.stringify(current.circles)
		});
	}
}

function addCurrentUser(userName, emailAddress){
	/*var userName = prompt("What is your name?");
	var emailAddress = prompt("What is your email address?");*/
	if(userName != null){
		navigator.geolocation.getCurrentPosition(updateCoords);
		addUsers([new User({
			id: null,
			name: userName,
			email: emailAddress,
			latitude: userLocation.getLat(),
			longitude: userLocation.getLon(),
			accuracy: userLocation.getAccuracy(),
			circles: JSON.stringify(userLocation.circles)
		})]);
		getUsers();
	}
}

function updateUser(user, position){
	var userDatabase = new Firebase('https://circleup.firebaseio.com/users');
	navigator.geolocation.getCurrentPosition(updateCoords);
	var newLocation = position || userLocation.coordinates;
	userDatabase.child(user.id).update({
		latitude: newLocation.latitude,
		longitude: newLocation.longitude,
		accuracy: newLocation.accuracy
	});
	//getUsers();
}