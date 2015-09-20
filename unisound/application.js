/* DB API */
// get a reference of the database
var ref = new Firebase("https://amber-torch-7758.firebaseio.com");
var songsRef = new Firebase("https://amber-torch-7758.firebaseio.com/songs");

// add song method
var addSong = function(songJSON) {
    songRef = ref.child("songs").child(songJSON.id);
    songRef.set(songJSON);
};

// delete a song from the list
var deleteSong = function(songID) { 
    ref.child("songs").child(songID).remove();
};

var update = function(songID, key, value) {
    ref.child("songs").child(songID).child(key).set(value);
};

// read all objects from the database and also continuously read when a Song is added
var readAll = function(callback) {
    songsRef.on("child_added", function(snapshot) {
        console.log(dataToSong(snapshot.val()));
        jukebox.addSongs([dataToSong(snapshot.val())]);
    });
};

// update the host when a new song is added
ref.on("value", function(snapshot) {
    console.log("This is the snapshot of songs");
    var snapshotObj = snapshot.child("songs").val();
    var songs = [];
    for (var key in snapshotObj) {
	if (snapshotObj.hasOwnProperty(key)) {
	    console.log(key + "->" + snapshotObj[key].title);
	    songs.push(dataToSong(snapshotObj[key]));
	}
    }
    console.log(songs);

    jukebox.addSongs(songs);
    console.log("after addsong");
}, function(errorObject) {
    console.log("The read failed");
});

/*
var cSong = {
    "artist": "ColdPlay",
    "artistID": "7dGJo4oG8kP0tJRR",
    "genre": "grea",
    "id": "6yr8GiT6Q5ebdT",
    "popularity": 1,
    "score": 1,
    "title": "Yellowwwwww"
};
*/

function getSongJSON(trackID){
    for(var s = 0; s < jukebox.getSongs().length; s++){
	if(jukebox.getSongs()[s].getID() == trackID){
	    return jukebox.getSongs()[s];
	}
    }
}

// write a track to the DB
function postTrack(trackID){
    var json = getSongJSON(trackID);
    addSong(json);
}
