var PATH = "https://simulation-timer.firebaseio.com/";

function loadConfiguration(key){
	var firebase = new Firebase(PATH + key);
		firebase.once("value", function(snapshot){
			var config = snapshot.val();
			CONFIG = config;
		});
}