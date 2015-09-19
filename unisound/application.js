function getSongJSON(trackID){
	for(var s = 0; s < jukebox.getSongs().length; s++){
		if(jukebox.getSongs()[s].getID() == trackID){
			return JSON.stringify(jukebox.getSongs()[s]);
		}
	}
}

function postTrack(trackID){
	//alert("POST: " + trackID + " TO SERVER.");
	var track = getTrack(trackID);
	addTrackToDB();
	var json = getSongJSON(trackID);
	alert("POST: " + json + " TO SERVER.");
}