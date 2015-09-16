function Person(id, firstName, lastName){
	this.id = id;
	this.firstName = firstName;
	this.lastName = lastName;
}

Person.prototype.toString = function(){
	return this.firstName + " " + this.lastName + " (" + this.id + ")";
}