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

function handlePlaylist(data){
	var ownerID = data.owner.id;
	var playlistID = data.id;
	loadPlaylistPlayer(ownerID, playlistID);
}

function loadPlaylistPlayer(ownerID, playlistID){
	var player = document.getElementById('player');
	player.innerHTML = '<iframe src="https://embed.spotify.com/?uri=spotify%3Auser%3A' + ownerID + '%3Aplaylist%3A' + playlistID + '" width="100%" height="380" theme="white" frameborder="0" allowtransparency="true"></iframe>'
	console.log('<iframe src="https://embed.spotify.com/?uri=spotify%3Auser%3A' + ownerID + '%3Aplaylist%3A' + playlistID + '" width="300" height="380" frameborder="0" allowtransparency="true"></iframe>');
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
			handlePlaylist(data);
		}
	});
}

function addTrackToPlaylist(ownerID, playlistID, trackID){
	$.ajax({
		type: "POST",
		url: spotifyBase + 'v1/users/' + ownerID + '/playlists/' + playlistID + '/tracks?position=0&uris=spotify%3Atrack%3A' + trackID,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("Authorization", "Bearer " + bearer)
			
		},
		success: function(data){
			console.log(data);
			loadPlaylistPlayer(ownerID, playlistID);
		}
	});
}

/*var owner = "1285594060";
var playlist = "2r7tkFG3aLznuVaLTyaIcb";
getPlaylist(owner, playlist);
var rapNemesis = "3Fr6Wa1ap0Lv9KZ0lxGkiE"
addTrackToPlaylist(owner, playlist, rapNemesis);*/