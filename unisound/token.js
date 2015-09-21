var spotifyAccounts = "https://accounts.spotify.com/authorize";

function getToken(){
	$.ajax({
		type: "GET",
		url: spotifyAccounts + '/?client_id=' + clientID + '&response_type=code&redirect_uri=http%3A%2F%2Fvingkan.github.io%2Funisound',
		beforeSend: function(xhr) {
			xhr.setRequestHeader("Authorization", "Bearer " + bearer)
			
		},
		success: function(data){
			console.log(data);
		}
	});
}