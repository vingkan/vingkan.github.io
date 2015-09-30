function Storage(){
	this.data = [];
}

Storage.prototype.add = function(object){
	this.data.push(object);
}

Storage.prototype.get = function(id){
	var response = null;
	for(var d = 0; d < this.data.length; d++){
		if(this.data[d].id == id){
			response = this.data[d].data
		}
	}
	if(response != null){
		return response;
	}
	else{
		console.log("Failure: Could not get data with that id.");
	}
}