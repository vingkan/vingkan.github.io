var SEARCH_LIMIT = 10;

function sendSearchQuery(){
	jukebox.clearForSearch();
	var searchBar = document.getElementById('searchBar');
	var query = sanitize(searchBar.value);
	getSearch(query, 'track');
}

function sanitize(input){
	var query = input.toLowerCase();
	return query;
}

function chooseFromResults(data, type){
	var results = [];
	switch(type){
		case 'artist':
			console.log('choose an artist from schema!');
			break;
		case 'track':
			for(var t = 0; t < SEARCH_LIMIT; t++){
				results.push(data.tracks.items[t]);
				//console.log('queried: ' + data.tracks.items[t].name);
			}
			break;
		default: 
			console.log("ERROR: Ran out of selection cases.");
			break;
	}
	return results;
}

function getSearchData(data, type){
	var results = chooseFromResults(data, type);
	var dataPackets = [];
	switch(type){
		case 'artist':
			// add loop
			dataPackets = getArtistData(results);
			break;
		case 'track':
			for(var t = 0; t < results.length; t++){
				dataPackets.push(getTrackData(results[t]));
			}
			break;
		default: 
			console.log("ERROR: Ran out of parsing cases.");
			break;
	}
	return dataPackets;
}

function handleSearchData(searchData, type){
	switch(type){
		case 'artist':
			console.log('handle artist');
			break;
		case 'track':
			for(var t = 0; t < searchData.length; t++){
				handleTrackData(searchData[t]);
			}
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