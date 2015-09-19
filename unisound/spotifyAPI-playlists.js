/*
* Not sure if this function is working.
*/
function createPlaylist(eventTitle){
	$.ajax({
		type: "POST",
		url: spotifyBase + 'v1/users/unisound.wuhack2015/playlists/',
		data: {
				"name": eventTitle,
				"public": true
			},
		beforeSend: function(xhr) {
			xhr.setRequestHeader("Authorization", "Bearer " + bearer)
			
		},
		success: function(data){
			console.log(data);
		}
	});
}

function loadPlaylistPlayer(data){
	var ownerID = data.owner.id;
	var playlistID = data.id;
	var player = document.getElementById('player');
	player.innerHTML = '<iframe src="https://embed.spotify.com/?uri=spotify%3Auser%3A' + ownerID + '%3Aplaylist%3A' + playlistID + '" width="300" height="380" frameborder="0" allowtransparency="true"></iframe>'
}

function getPlaylist(ownerID, playlistID){
	$.ajax({
		type: "GET",
		url: spotifyBase + 'v1/users/' + ownerID + '/playlists/' + playlistID,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("Authorization", "Bearer " + bearer)
			
		},
		success: function(data){
			console.log(data);
			loadPlaylistPlayer(data);
		}
	});
}

/*var owner = "1285594060";
var playlist = "2r7tkFG3aLznuVaLTyaIcb";*/
var owner = "unisound.wuhack2015";
var playlist = "7htvGA5RQkm69Z5UsqjV2U";
getPlaylist(owner, playlist);