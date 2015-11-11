function convertOptionTagName(tag, toReadable){
	var response;
	if(toReadable){
		//Not ready for this case yet.
	}
	else{
		response = tag.replace(/\s+/g, '-').toLowerCase();
	}
	return response;
}

console.log("LOADED utils.js");