function initScrollingHeader(){
	window.addEventListener('scroll', function(event){
		var distanceY = window.pageYOffset || document.documentElement.scrollTop,
			shrinkOn = 50,
			header = document.querySelector("header");
		if(distanceY > shrinkOn){
			classie.add(header, "smaller");
		}
		else{
			if(classie.has(header, "smaller")){
				classie.remove(header, "smaller");
			}
		}
	});
}

window.onload = initScrollingHeader();

function toggleWindow(windowID){
	var credentialWindow = document.getElementById(windowID);
	var shade = document.getElementById('shade');
	//console.log(credentialWindow.style.height)
	if(credentialWindow.style.height == '92vh'){
		credentialWindow.style.height = '0vh';
		shade.style.display = 'none';
	}
	else{
		credentialWindow.style.height = '92vh';
		shade.style.display = 'block';
	}
}

/*--------------------------------------------*/
/*---> KEY BINDINGS <-------------------------*/
/*--------------------------------------------*/

$('#loginEmail').keypress(function(event){
	if(event.keyCode == 13){
		login();
	}
});

$('#newName').keypress(function(event){
	if(event.keyCode == 13){
		addNewUser();
	}
});

/*--------------------------------------------*/
/*---> LOADING <------------------------------*/
/*--------------------------------------------*/

//CLOSURES BRO!
function loadingSequence(){

	var loadingMessages = [
		"Calculating the number of radians in a circle",
		"Locating fire hydrants",
		"Tasting the local cuisine",
		"Telling you a joke",
		"Firing up firebase",
		"Hoping for good weather",
		"Dropping out of college for this startup",
		"Rolling the dice",
		"Making up more loading messages",
		"Deleting FOIA requests",
		"Disrupting Uber's market",
		"Uploading dank memes to the cloud",
		"Switching latitude and longitude",
		"Gently brushing your GPS",
		"Checking out the cute guys on street view",
		"Searching for Chipotle locations",
		"Deleting Comic Sans MS",
		"Raising startup capital",
		"Commenting out bad code",
		"Twerking",
		"Running for President",
		"Delaying the singularity",
		"Routing to the nearest bathroom",
		"Assigning absurd variable names",
		"Questioning the meaning of life",
		"Planting easter eggs in the source code",
		"Evaluating your life choices",
		"Solving the RedEye sudoko puzzle",
		"Throwing out old business model",
		("rock paper scissors shoot").split(" "),
		("You just got rick-rolled").split(" "),
		("Did you catch that one?").split(" ")
	];

	var usedMessages = [];

	function getRandomLoadingMessage(){
		var defaultMessage = "All out of loading messages! Time to get a new phone";
		var lastMessage = usedMessages[usedMessages.length - 1];
		var message = "";
		if(loadingMessages.length > 0){
			var random = Math.floor(Math.random() * loadingMessages.length);
			message = loadingMessages[random];
			if($.isArray(lastMessage)){
				console.log("was the last a burst? " + $.isArray(lastMessage))
				var tryCounter = 1;
				var found = false;
				while($.isArray(message)){
					found = false;
					if(tryCounter >= (loadingMessages.length - 1)){
						message = "Checking if he's dead, Jim";
					}
					else if(loadingMessages.length > 1){
						random = Math.floor(Math.random() * loadingMessages.length);
						message = loadingMessages[random];
						found = true;
					}
					else{
						message = defaultMessage;
					}
					tryCounter++;
				}
				if(found){
					usedMessages.push(message);
					loadingMessages.splice(random, 1);
				}
				console.log('replace with: ' + message)
			}
			else{
				usedMessages.push(message);
				loadingMessages.splice(random, 1);
			}
		}
		else{
			message = defaultMessage;
		}
		return message;
	}

	function getValueFromUnit(unit){
		var value = unit.substr(0, (unit.length - 2));
		return parseFloat(value);
	}

	function incrementLoadingDisplay(){
		var stillLoading = true;
		var display = document.getElementById('loadingBar');
		var width = display.style.width;
		var loadedWidth = getValueFromUnit(display.style.width);
		var scale = 0.40; //Scale of display size
		var inputWidth = loadedWidth; //Get DOM Width
		var displayLoadedWidth = inputWidth / scale;
		var max = 15;
		var min = 5;
		var random = Math.floor(Math.random() * (max - min)) + min;
		displayLoadedWidth += random;
		if(displayLoadedWidth >= 100){
			stillLoading = false;
			displayLoadedWidth = 100;
		}
		var outputWidth = displayLoadedWidth * scale;
		//Set style to new displayLoadedWidth
		display.style.width = outputWidth + 'vh';
		var loadingPercentage = document.getElementById('loadingPercentage');
		var percentage = Math.floor(displayLoadedWidth) + '%';
		//console.log('Incrementing: ' + percentage);
		loadingPercentage.innerHTML = percentage;
		return stillLoading;
	}

	function runLoadingSequence(){
		var increment = 500;
		var loadingMessageSpace = document.getElementById('loadingMessage');
		loadingMessageSpace.innerHTML = "";
		var loadingPercentage = document.getElementById('loadingPercentage');
		var percentage = 0 + '%';
		var loadingPanel = document.getElementById('loading');
		loadingPanel.style.height = '100vh';
		var display = document.getElementById('loadingBar');
		display.style.width = 0 + 'vh';
		var stillLoading = true;
		/*
		* Replace the problematic setTimeout() inside the while loop with a
		* setInterval() and break condition.
		* Thanks to http://stackoverflow.com/questions/12996193/settimeout-inside-while-loop
		* for leading me back from the world of browser crashes.
		*/
		var intervalID = window.setInterval(function(){
			var message = getRandomLoadingMessage();
			if($.isArray(message)){
				var subIncrement = Math.floor(increment / message.length);
				var subMessage = 0;
				var subMessageInterval = setInterval(function(){
					if(subMessage >= message.length){
						clearInterval(subMessageInterval);
					}
					else{
						loadingMessageSpace.innerHTML = message[subMessage] + ' . . .';
						//console.log('POSTED: ' + message[subMessage] + ' . . .')
						subMessage++;
					}
				}, subIncrement);
			}
			else{
				loadingMessageSpace.innerHTML = message + ' . . .';
				//console.log('POSTED: ' + message + ' . . .')
			}
			stillLoading = incrementLoadingDisplay();
			if(!stillLoading){
				clearInterval(intervalID);
				loadingPanel.style.height = '0vh';
				//Replenish the message arrays
				Array.prototype.push.apply(loadingMessages, usedMessages);
			}
		}, increment);
	}

	runLoadingSequence();

}