vex.defaultOptions.className = 'vex-theme-wireframe';

var SAMPLE_MEMBERS = [
	{
		name: "The Annoying One",
		picture: "style/propic/vinesh.jpg"
	},
	{
		name: "The Arrogant One",
		picture: "style/propic/brendan.jpg"
	},
	{
		name: "The Creepy One",
		picture: "style/propic/sunny.jpg"
	},
	{
		name: "The Sleepy One",
		picture: "style/propic/evan.PNG"
	},
]

$("#signup-email").keypress(function(event){
	if(event.keyCode == 13){
		signup();
	}
});

$("#signup-button").click(function(event){
	signup();
});

$(".has-slot-data").click(function(event){
	var timestamp = parseInt(event.target.id.split("-")[2]);
	var numFree  = parseInt(event.target.innerHTML);
	showSlotData(timestamp, numFree)
});

function signup(){
	var email = document.getElementById('signup-email').value;
	var timestamp = new Date().getTime();
	var data = {
		email: email,
		timestamp: timestamp
	}
	var firebase = new Firebase("https://omnipointment.firebaseio.com/signup");
	firebase.push(data);
	console.log(data);
	var signupDiv = document.getElementById('signup-div');
		signupDiv.innerHTML = "<p>Thank you for your interest!</p>";
}

//vex.dialog.alert("Welcome!");

function showSlotData(timestamp, numFree){
	var slotDateTime = moment(timestamp).format("M/D h:mm A");
	var html = '';
		html += '<h2>' + slotDateTime + '</h2>';
	if(numFree > 0){
		SAMPLE_MEMBERS = shuffle(SAMPLE_MEMBERS);
		var fraction = numFree / SAMPLE_MEMBERS.length;
		var punctuation = (fraction > 0.75) ? '!' : ((fraction > 0.45) ? '.' : ' :(');
		var percentage = (100 * (fraction)).toFixed(1);
		html += '<p>' + percentage + '% of your team is free' + punctuation + '</p>';
		for(var m = 0; m < numFree; m++){
			var member = SAMPLE_MEMBERS[m];
			html += '<div class="member-data">';
			html += '<div class="member-data-img" style="background-image: url(' + member.picture + ');"></div>';
			html += '<div class="member-data-name">' + member.name + '</div>';
			html += '</div>';
		}
	}
	else{
		html += '<p>No one is free :(</p>';
	}
	html += "<p>You don't always get to choose your teammates, but you should be able to choose when you meet.</p>";
	vex.dialog.alert(html);
}

function shuffle(array){
	var currentIndex = array.length;
	var temp;
	var random;
	while(currentIndex !== 0){
		random = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		temp = array[currentIndex];
		array[currentIndex] = array[random];
		array[random] = temp;
	}
	return array;
}

function giveFeedback(){
	vex.dialog.prompt({
		message: "Hi! Care to give us some feedback on omnipointment?",
		placeholder: "ex. Cool name, app needs work.",
		callback: function(feedback){
			if(feedback){
				postFeedback(feedback);
				vex.dialog.alert(`Thank you!<br>Check us out <a href="https://github.com/vingkan/omnipointment/">on GitHub.</a>`);
			}
		}
	});
}

function postFeedback(feedback){
	var timestamp = new Date().getTime();
	var firebase = new Firebase("https://omnipointment.firebaseio.com/feedback");
	firebase.push({
		timestamp: timestamp,
		feedback: feedback
	});
}

$("#give-feedback").click(function(event){
	giveFeedback();
});