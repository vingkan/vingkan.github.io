function sendSearchQuery(){
	var searchBar = document.getElementById('searchBar');
	var query = sanitize(searchBar.value);
	getSearch(query, 'track');
}

function sanitize(input){
	var query = input.toLowerCase();
	return query;
}

function chooseFromResults(data, type){
	var bestResult = null;
	switch(type){
		case 'artist':
			console.log('choose an artist from schema!');
			break;
		case 'track':
			bestResult = data.tracks.items[0];
			break;
		default: 
			console.log("ERROR: Ran out of selection cases.");
			break;
	}
	return bestResult;
}

function getSearchData(data, type){
	var bestResult = chooseFromResults(data, type);
	var dataPacket = null;
	switch(type){
		case 'artist':
			dataPacket = getArtistData(bestResult);
			break;
		case 'track':
			dataPacket = getTrackData(bestResult);
			break;
		default: 
			console.log("ERROR: Ran out of parsing cases.");
			break;
	}
	return dataPacket;
}

function handleSearchData(searchData, type){
	switch(type){
		case 'artist':
			console.log('handle artist');
			break;
		case 'track':
			handleTrackData(searchData)
			break;
		default: 
			console.log("ERROR: Ran out of handling cases.");
			break;
	}
}

function getSearch(query, type){
	$.ajax({
		url: spotifyBase + 'v1/search?q=' + formatQuery(query) + '&type=' + type,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("Authorization", "Bearer " + bearer)
		},
		success: function(data){
			var searchData = getSearchData(data, type);
			serveData(searchData);
			handleSearchData(searchData, type);
		}
	});
}

function formatQuery(query){
	return query.replace(' ', '+');
}