/* DB API */
// get a reference of the database
var ref = new Firebase("https://amber-torch-7758.firebaseio.com");
var JBRef = new Firebase("https://amber-torch-7758.firebaseio.com/jukebox");
var songsRef = new Firebase("https://amber-torch-7758.firebaseio.com/jukebox/songs");
var jukeboxID = "";

// Increments the Jukebox ID counter in the database
var incrementID = function() {
    ref.child("id").once("value", function(data) {
        ref.update({"id": data.val() + 1});
    });
};

// Sets jukeboxID global variable to hexademical String ID value
var getNewID = function() {
    ref.child("id").once("value", function(data) {
       jukeboxID = data.val().toString(16);
    });
};

// Returns name of the Jukebox with JukeID input
var fetchName = function(jukeID) {
    val = jukeID;
    toReturn = "";
    ref.on("child_added", function(snapshot) {
        if (snapshot.child("boxID").val() == val) {
            console.log("Input: " + jukeID + ", output: " + snapshot.child("name").val() + " BoxID: " + snapshot.child("boxID").val());
            toReturn = snapshot.child("name").val();
        } else {
            toReturn = null;
        }
    });
    return toReturn;
}

var addUser = function(songID) {
    songsRef.child(songID).once("value", function(data) {
        console.log(data);
        songsRef.child(songID).update({users: data.child("users").val() + 1});
    });
}

/**var getNumUsers = function(songID) {
    var num = 0;
    songsRef.child(songID).once("value", function(data) {
        num = data.child("users").val();
    });
    return num;
}*/

// ADD GETUSERS HERE

// Instantiates jukebox in database
var createJukebox = function() {
    getNewID();
    incrementID();

    JBRef.update({
        "name": jukebox.name,
        "boxID": jukeboxID
    });

};

var joinJukebox = function(jbID) {
    jukeboxID = jbID;
};

// add song method
var addSong = function(songJSON) {
    console.log(songJSON);
    songRef = songsRef.child(songJSON.id);
    console.log(songsRef.child(songJSON.id));
    songRef.set(songJSON);
};

// delete a song from the list
var deleteSong = function(songID) { 
    JBRef.child("songs").child(songID).remove();
};

var update = function(songID, key, value) {
    songsRef.child(songID).child(key).set(value);
};

// read all objects from the database and also continuously read when a Song is added
var readAll = function(callback) {
    songsRef.on("child_added", function(snapshot) {
        song = dataToSong(snapshot.val());
        console.log(snapshot.val());
        song.isQuery = false;
        jukebox.addSongs([song]);
    });
};

/**var updateAll = function(callback) {
    songsRef.on("child_changed", function(snapshot) {
        song = dataToSong(snapshot.val());
        song.isQuery = false;
        jukebox.addSongs([song]);
    }
}*/

// Update all when value is changed
JBRef.on("value", function(snapshot) {
    console.log(snapshot.val());
    var snapshotObj = snapshot.child("songs").val();
    var songs = [];
    for (var key in snapshotObj) {
	if (snapshotObj.hasOwnProperty(key)) {
        snapshotObj[key].isQuery = false;
	    songs.push(dataToSong(snapshotObj[key]));
	}
    }
    
    jukebox.addSongs(songs, snapshot.val());

}, function(errorObject) {
    console.log("The read failed");
});

function getSongJSON(trackID){
    for(var s = 0; s < jukebox.getSongs().length; s++){
	if(jukebox.getSongs()[s].getID() == trackID){
	    return jukebox.getSongs()[s];
	}
    }
}


function postTrack(trackID){
    var json = getSongJSON(trackID);
    json.isQuery = false;
    addSong(json);
}
