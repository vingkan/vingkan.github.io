var USER_ID;// = '103105083532765828171';

function checkUserInDatabase(authData){
	USER_ID = authData.google.id;
	var path = "https://omnipointment.firebaseio.com/users/" + USER_ID;
	var userRef = new Firebase(path);
	userRef.once('value', function(snapshot){
		if(!snapshot.exists()){
			var userGoogleData = new Firebase(path + "/google");
			userGoogleData.set({
				uid: USER_ID,
				name: authData.google.displayName,
				email: authData.google.email,
				img: authData.google.profileImageURL
			});
			var userProfileData = new Firebase(path + "/profile");
			userProfileData.set({
				events: JSON.stringify([])
			});
			toggleSection('view-menu');
		}
		else{
			toggleSection('view-menu');
		}
	});
}

function googleLogin(){
	var ref = new Firebase("https://omnipointment.firebaseio.com");
	ref.authWithOAuthPopup('google', function(error, authData){
		if(error){
			console.log(error);
		}
		else{
			console.log(authData);
			authObject = authData;
			checkUserInDatabase(authData);
		}
	},
	{
		scope: "email"
	});
}

console.log('LOADED user.js');