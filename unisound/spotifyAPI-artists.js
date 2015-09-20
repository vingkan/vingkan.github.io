function getArtistData(data){
	var genre = null;
	// Handle Exceptions
	if(data.genres.length == 0){
		genre = 'none'; // Might need a new default value later
	}
	else{
		genre = data.genres[0];
	}
	return {
		'id': data.id,
		'name': data.name,
		'genre': genre
	};
}

function handleArtistData(artistData){
	var artist = dataToArtist(artistData);
	jukebox.addArtists([artist]);
	jukebox.updateGenres();
	jukebox.update('r');
}

function getArtist(artistID){
	$.ajax({
		url: spotifyBase + 'v1/artists/' + artistID,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("Authorization", "Bearer " + bearer)
		},
		success: function(data){
			var artistData = getArtistData(data);
			serveData(artistData);
			handleArtistData(artistData);
		}
	});
}