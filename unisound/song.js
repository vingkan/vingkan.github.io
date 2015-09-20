/*--------------------------------------------*/
/*---> GLOBALS <------------------------------*/
/*--------------------------------------------*/

/*
* Global weighting values for calculating song scores
*/
var WEIGHT = {
	'VOTES': 2.0,
	'FAIRNESS': 1.2,
	'POPULARITY': 1.5
};

function previewSong(previewLink){
	var source = '<audio autoplay><source src="' + previewLink + '"></source></audio>';
	var previewPlayer = document.getElementById('previewPlayer');
	previewPlayer.innerHTML = source;
	previewPlayer.innerHTML += '<button id="stopButton" onclick="stopPreview();">Stop Preview</button>';
}

function stopPreview(){
	var previewPlayer = document.getElementById('previewPlayer');
		previewPlayer.innerHTML = "";
}

function dataToSong(trackData){
	var song = new Song(
		trackData.id,
		trackData.title,
		trackData.artistsID,
		trackData.artists,
		trackData.genre,
		getDeviceIP()
	);
	// Update Artist
	getArtist(song.artistID);
	// ADD SPOTIFY GOODIES
	song.popularity = trackData.popularity;
	song.image = trackData.image;
	song.preview = trackData.preview;
	song.calculateScore()
	return song;
}

/*--------------------------------------------*/
/*---> SONG CLASS <---------------------------*/
/*--------------------------------------------*/

function Song(id, title, artistID, artist, genre, userID){
	this.id = id;
	this.title = title;
	this.artistID = artistID;
	this.artist = artist;
	this.genre = genre;
	this.users = [];
	this.users.push(userID || 'anonUser');
	this.isLocked = false;
	// FROM SPOTIFY
	this.popularity = 0;
	this.image = 'null';
	this.preview = 'null';
	// FROM SPOTIFY
	this.score = 0;
	this.calculateScore();
}

Song.prototype.calculateScore = function(){
	var newScore = 0;
	newScore += this.getUsers().length * WEIGHT.VOTES;
	newScore += this.popularity * WEIGHT.POPULARITY;
	this.setScore(newScore);
}

Song.prototype.toString = function(){
	return '[' + this.score + '] ' + this.title + ' by ' + this.artist + ' (' + this.genre.toTitleCase() + ')';
}

Song.prototype.toHTML = function(type){
	var html = '';
	if(type == 's'){
		html += '<div class="item">';
		html += '<button onclick="postTrack(&#39;' + this.getID() + '&#39;);">+</button>';
		html += getSongPlayer(this.getID());
		html += '</div>';
	}
	else if(type == 'r'){
		html += '<div class="songWrapper" onclick="previewSong(&#39;' + this.preview + '&#39;);">';
		//html += '<div class="trackSelector">&#9834;+</div>';
		html += '<img class="albumPicture" src="' + this.image + '" onclick="postTrack(&#39;' + this.getID() + '&#39;);">'
		html += '<div class="songResult"><h2>' + this.title + '</h2><h3>' + this.artist + '</h3></div>';
		html += '</div>';
	}
	else if(type == 'q'){
		html += '<div class="songWrapper">';
		//html += '<div class="trackSelector">&#9834;+</div>';
		html += '<img class="albumPicture" src="' + this.image + '">'
		html += '<div class="songResult"><h2>' + this.title + '</h2><h3>' + this.artist + '</h3></div>';
		var icon = 'X';
		if(this.isLocked){
			icon = '&#128274;';
			html += '<button class="removeButton">' + icon + '</button>';
		}
		else{
			html += '<button class="removeButton" onclick="removeFromQueue(&#39;' + this.id + '&#39;)">' + icon + '</button>';			
		}

		html += '</div>';
	}
	return html;
}

/*--------------------------------------------*/
/*---> GETTERS & SETTERS <--------------------*/
/*--------------------------------------------*/

Song.prototype.getID = function(){
	return this.id;
}

Song.prototype.getTitle = function(){
	return this.title;
}

Song.prototype.setTitle = function(title){
	this.title = title;
}

Song.prototype.getArtist = function(){
	return this.artist;
}

Song.prototype.setArtist = function(artist){
	this.artist = artist;
}

Song.prototype.getGenre = function(){
	return this.genre;
}

Song.prototype.setGenre = function(genre){
	this.genre = genre;
}

Song.prototype.getUsers = function(){
	return this.users;
}

/*
* Note that userID is an array of userIDs, be sure to wrap in [] brackets, even when pushing only a single userID
*/
Song.prototype.addUsers = function(userID){
	for(var u = 0; u < userID.length; u++){
		this.users.push(userID[u]);
	}
}

Song.prototype.getScore = function(){
	return this.score;
}

Song.prototype.setScore = function(score){
	this.score = score;
}
