var colorSwatch = [];
	colorSwatch.push(new Swatch('aqua', '#006955'));

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

for(var i = 0; i < portfolio.length; i++){
	portfolioBody.innerHTML += portfolio[i].toHTML();
}