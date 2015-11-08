function logStack(task){
	var stackLog = document.getElementById('stack-log');
	stackLog.value += task + "\n";
}

function toggleStackLog(view){
	var stackLog = document.getElementById('stack-log');
	if(view){
		stackLog.style.display = 'block';
	}
	else{
		stackLog.style.display = 'none';
	}
}

function Task(data){
	this.round = parseFloat(data['round']);
	this.type = data['player'];
	this.objectID = data['id'];
	this.attribute = data['attribute'];
	this.value = data['value'];
	this.executed = false;
}

Task.prototype.toString = function(){
	return this.round + '. (' + this.objectID + ')[' + this.attribute + '] = ' + this.value + ';';
}

Task.prototype.execute = function(){
	if(!this.executed && this.round == game.rounds){
		var object = game.getObjectById(this.type, this.objectID);
		object.set(attribute, value);
		this.executed = true;
		this.print();
	}
}

Task.prototype.print = function(){
	logStack(this);
}