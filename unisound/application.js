/* DB API */
// get a reference of the database
var ref = new Firebase("https://amber-torch-7758.firebaseio.com");

// add song method
var addSong = function(songJSON) {
    songRef = ref.child(songJSON.id);
    songRef.set(songJSON);
};

// delete a song from the list
var deleteSong = function(songID) { 
    ref.child(songID).remove();
};

var update = function(songID, key, value) {
    ref.child(songID).child(key).set(value);
};

// read all objects from the database at once
var readAll = function(callback) {
    ref.once("value", callback);
};

var cSong = {
    "artist": "ColdPlay",
    "artistID": "7dGJo4oG8kP0tJRR",
    "genre": "grea",
    "id": "6yr8GiT6Q5ebdT",
    "popularity": 1,
    "score": 1,
    "title": "Yellow"
};

function getSongJSON(trackID){
    for(var s = 0; s < jukebox.getSongs().length; s++){
        if(jukebox.getSongs()[s].getID() == trackID){
            return JSON.stringify(jukebox.getSongs()[s]);
        }
    }
}

// write a track to the DB
function postTrack(trackID){    
    var json = getSongJSON(trackID);
    alert("POST: " + json + " TO SERVER.");   
    addSong(cSong);
    addSong(json);
}
