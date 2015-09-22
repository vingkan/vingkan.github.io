function sendToPlayer(trackID){
	var player = document.getElementById('player');
	var iframe = '<iframe class="iframePlayer" src="https://embed.spotify.com/?uri=spotify%3Atrack%3A' + trackID + '" frameborder="0" allowtransparency="true"></iframe>';
	player.innerHTML += iframe;
}

function getSongPlayer(trackID){
	var iframe = '<iframe class="iframePlayer" src="https://embed.spotify.com/?uri=spotify%3Atrack%3A' + trackID + '" theme="white" frameborder="0" allowtransparency="true"></iframe>';
	return iframe;
}

function getTrackData(data){
	return {
		'id': data.id,
		'title': data.name,
		'artistID': data.artists[0].id,
		'artist': data.artists[0].name,
		'popularity': data.popularity,
		'genre': 'null',
		'image': data.album.images[0].url,
		'preview': data.preview_url
	};
}

function handleTrackData(trackData){
	var song = dataToSong(trackData);
	jukebox.addSongs([song]);
	/* Don't update jukebox until artist callback,
	which was fired by song callback, is complete*/
	//jukebox.update();
}

function getTrack(trackID){
	$.ajax({
		url: spotifyBase + 'v1/tracks/' + trackID,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("Authorization", "Bearer " + bearer)
			//xhr.setRequestHeader('Authorization': 'Basic ' + (new Buffer(clientID + ':' + clientSecret).toString('base64')))
		},
		success: function(data){
			var trackData = getTrackData(data);
			serveData(trackData);
			handleTrackData(trackData);
			return trackData;
		}
	});
}