function getData(){
	return {
		time: 1450489033624,
		minutes: 15
	}
}

function interp(){
	var person = {
		name: "Brendan",
		activity: "summoner"
	}
	var note = `Our good friend ${person.name} is a word-class ${person.activity}!`;
	return note;
}

const kek = 42;

module.exports.getData = getData;
module.exports.interp = interp;
module.exports.kek = kek;