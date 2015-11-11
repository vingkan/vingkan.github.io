var userID;
var authObject;

function checkUserInDatabase(authData){
	userID = authData.google.id;
	var usersDatabase = new Firebase("https://tinderpreneurship.firebaseio.com/users/" + userID + "/google");
	usersDatabase.set({
		uid: userID,
		name: authData.google.displayName,
		email: authData.google.email,
		img: authData.google.profileImageURL
	});
}

function googleLogin(){
	var ref = new Firebase("https://tinderpreneurship.firebaseio.com");
	ref.authWithOAuthPopup('google', function(error, authData){
		if(error){
			console.log(error);
		}
		else{
			console.log(authData);
			authObject = authData;
			checkUserInDatabase(authData);
			document.getElementById('profile').style.display = 'block';
			document.getElementById('login').style.display = 'none';
		}
	},
	{
		scope: "email"
	});
}

console.log("LOADED googleAuth.js");