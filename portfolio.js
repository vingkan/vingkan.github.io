var colorSwatch = [];
	colorSwatch.push(new Swatch('aqua', '#006955'));
	colorSwatch.push(new Swatch('purple', '#1a082e'));
	colorSwatch.push(new Swatch('orange', '#cc6000'));
	colorSwatch.push(new Swatch('lightBlue', '#007cd2'));
	colorSwatch.push(new Swatch('lime', '#89de00'));
	colorSwatch.push(new Swatch('red', '#de0200'));

function createTrial(link){
	var html = " <a target='_blank' href='" + link + "'>+</a>";
	return html;
}

function printAll(portfolios){
	var count = 0;
	for(var p = 0; p < portfolios.length; p++){
		var section = document.getElementById(portfolios[p].name);
		for(var i = 0; i < portfolios[p].projects.length; i++){
			section.innerHTML += portfolios[p].projects[i].toHTML(count);
			toggle(count);
			toggle(count);
			count++;
		}
	}
}

function toggle(idNumber){
	var dateTag = 'date' + idNumber;
	var noteTag = 'ul' + idNumber;
	var dateLine = document.getElementById(dateTag);
	var noteList = document.getElementById(noteTag);
	if(dateLine.style.display == 'block'){
		dateLine.style.display = 'none';
		noteList.style.display = 'none';
	}
	else{
		dateLine.style.display = 'block';
		noteList.style.display = 'block';
	}
}

var education = [];
	education.push(new Project(
			"The Hollister Simulation",
			"Illinois Mathematics and Science Academy",
			"December 2014 - March 2015",
			"lightBlue",
			false,
			"Led a five-person team to design a six-hour, immersive simulation for 70+ students to improve collaboration skills.", [
				"Note 1.",
				"Note 2.",
				"Note 3."
	]));
	education.push(new Project(
			"Student Computer Science Initiative",
			"Illinois Mathematics and Science Academy",
			"October 2014 - June 2015",
			"lime",
			false,
			"Launched student-led initiative to make computer science courses more engaging, interdisciplinary, and collaborative.", [
				"Note 1.",
				"Note 2.",
				"Note 3."
	]));
	education.push(new Project(
			"School of STEAM Innovation",
			"Illinois Mathematics and Science Academy",
			"December 2014 - June 2015",
			"aqua",
			false,
			"Created curriculum for two-semester program to train 40+ students in interdisciplinary thinking and collaboration.", [
				"Note 1.",
				"Note 2.",
				"Note 3."
	]));
	education.push(new Project(
			"TALENT Entrepreneurial Organization",
			"Illinois Mathematics and Science Academy",
			"September 2012 - June 2015",
			"orange",
			false,
			"Designed events and packaged curriculum as a student board member to expose 350+ students to entrepreneurship and innovation.", [
				"Note 1.",
				"Note 2.",
				"Note 3."
	]));
	education.push(new Project(
			"Northern Illinois Leadership Conference",
			"Boy Scouts of America, OMNI Youth Services",
			"May - August 2013",
			"purple",
			false,
			"Led 10-person team to develop workshops to empower middle school students in public speaking, leadership and academics.", [
				"Note 1.",
				"Note 2.",
				"Note 3."
	]));

var programming = [];
	programming.push(new Project(
			"FlowD Debate App" + createTrial('http://vingkan.github.io/flowd/'),
			"National Speech and Debate Association",
			"June 2014",
			"red",
			false,
			"Created and tested web app for debaters at the 2014 Kansas Nationals to track arguments in rounds paperlessly.", [
				"Note 1.",
				"Note 2.",
				"Note 3."
	]));

var educationPortfolio = new Portfolio('education', education);
var programmingPortfolio = new Portfolio('programming', programming);

printAll([
	educationPortfolio,
	programmingPortfolio
]);