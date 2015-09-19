/*--------------------------------------------*/
/*---> GLOBALS <------------------------------*/
/*--------------------------------------------*/

/*
* This function can be passed into a sort function as a comparator when sorting an array of songs
* Ex) var songs = [song1, song2, song3];
*     songs.sort(sortSongsByScores);
*     RESULT: [song2, song3, song1];
*/
function sortSongsByScores(song1, song2){
	return song2.getScore() - song1.getScore();
}

/*--------------------------------------------*/


/*---> JUKEBOX CLASS <------------------------*/
/*--------------------------------------------*/

function Jukebox(){
	this.songs = [];
	this.artists = []
}

Jukebox.prototype.update = function(){
	this.sort();
	var rankings = document.getElementById('rankings');
	rankings.innerHTML = this.toHTML();
}

Jukebox.prototype.sort = function(){
	this.songs.sort(function(a, b){
		return sortSongsByScores(a, b);
	});
}

Jukebox.prototype.updateGenres = function(){
	for(var s = 0; s < this.songs.length; s++){
		if(this.songs[s].getGenre() == 'null'){
			//console.log(this.songs[s].artistID)
			if(this.artistLoaded(this.songs[s].artistID)){
				var artist = this.getArtistById(this.songs[s].artistID);
				this.songs[s].setGenre(artist.genre);
			}
		}
	}
}

/*
* Song song: check jukebox for matches of this song
*/
Jukebox.prototype.addToExistingSong = function(newSong){
	var songExists = false;
	for(var s = 0; s < this.songs.length; s++){
		if(this.songs[s].getID() == newSong.getID()){
			this.songs[s].addUsers([newSong.getUsers()[0]]);
			this.songs[s].calculateScore();
			songExists = true;
		}
	}
	return songExists;
}

Jukebox.prototype.toHTML = function(){
	var html = "";
	for(var s = 0; s < this.songs.length; s++){
		html += '<li class="songRank">' + this.songs[s] + '</li>';
		html += '<li>' + getSongPlayer(this.songs[s].getID()) + '</li>';
	}
	return html;
}

Jukebox.prototype.toString = function(){
	var string = "";
	for(var s = 0; s < this.songs.length; s++){
		string += this.songs[s] + '<br>';
	}
	return string;
}

/*--------------------------------------------*/
/*---> GETTERS & SETTERS <--------------------*/
/*--------------------------------------------*/

Jukebox.prototype.getSongs = function(){
	return this.songs;
}

/*
* Note that songs is an array of songs, be sure to wrap in [] brackets, even when pushing only a single songs
*/
Jukebox.prototype.addSongs = function(songs){
	for(var s = 0; s < songs.length; s++){
		var songExists = this.addToExistingSong(songs[s]);
		if(!songExists){
			this.songs.push(songs[s]);
		}
	}
}

Jukebox.prototype.getArtists = function(){
	return this.artists;
}

Jukebox.prototype.artistLoaded = function(artistID){
	var loaded = false;
	for(var a = 0; a < this.artists.length; a++){
		if(this.artists[a].id == artistID){
			loaded = true;
		}
	}
	return loaded;
}

Jukebox.prototype.getArtistById = function(artistID){
	var response = null;
	for(var a = 0; a < this.artists.length; a++){
		if(this.artists[a].id == artistID){
			response = this.artists[a];
		}
	}
	return response;
}

/*
* Note that artists is an array of artists, be sure to wrap in [] brackets, even when pushing only a single artists
*/
Jukebox.prototype.addArtists = function(artists){
	for(var a = 0; a < artists.length; a++){
		//var songExists = this.addToExistingSong(artists[a]);
		//TO-DO Create Artist equivalent of this ^
		//if(!songExists){
			this.artists.push(artists[a]);
		//}
	}
}

