var colorSwatch = [];
	colorSwatch.push(new Swatch('aqua', '#006955'));
	colorSwatch.push(new Swatch('purple', '#1a082e'));
	
var portfolioBody = document.getElementById('portfolio');

var portfolio = [];
	portfolio.push(new Project(
			"STEAM School of Innovation",
			"Illinois Mathematics and Science Academy",
			"December 2014 - June 2015",
			"aqua",
			false,
			"Description.", [
				"Note 1.",
				"Note 2.",
				"Note 3."
	]));
	portfolio.push(new Project(
			"Northern Illinois Leadership Conference",
			"Boy Scouts of America, OMNI Youth Services",
			"May - August 2013",
			"purple",
			false,
			"Description.", [
				"Note 1.",
				"Note 2.",
				"Note 3."
	]));

function printAll(){
	for(var i = 0; i < portfolio.length; i++){
		portfolioBody.innerHTML += portfolio[i].toHTML(i);
		toggle(i);
		toggle(i);
	}
}

function toggle(idNumber){
	var dateLine = document.getElementById('date' + idNumber);
	var noteList = document.getElementById('ul' + idNumber);
	if(dateLine.style.display == 'block'){
		dateLine.style.display = 'none';
		noteList.style.display = 'none';
	}
	else{
		dateLine.style.display = 'block';
		noteList.style.display = 'block';
	}
}

printAll();