function assignUpdate(user){
	setInterval(function(){
		updateUser(user);
		console.log('Updating ' + user.name);
	}, 15000);
}

function getUsers(){
	var users = [];
	var userDatabase = new Firebase('https://circleup.firebaseio.com/users');
	userDatabase.once('value', function(snapshot){
		snapshot.forEach(function(childSnapshot){
			var key = childSnapshot.key();
			var childData = childSnapshot.val();
			var user = new User(childData);
			user.id = key;
			users.push(user);
			if(key === "-K11MnRD-xGAqonEV-4W"){
				assignUpdate(user);
			}
		});
		initGoogleMap(users);
	});
}

function addUsers(userArray){
	var userDatabase = new Firebase('https://circleup.firebaseio.com/users');
	for(var u = 0; u < userArray.length; u++){
		var current = userArray[u];
		userDatabase.push({
			id: current.id,
			name: current.name,
			latitude: current.getLat(),
			longitude: current.getLon()
		});
	}
}

function updateUser(user){
	var userDatabase = new Firebase('https://circleup.firebaseio.com/users');
	navigator.geolocation.getCurrentPosition(updateCoords);
	userDatabase.child(user.id).update({
		latitude: userLocation.getLat(),
		longitude: userLocation.getLon()
	});
	getUsers();
}