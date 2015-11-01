Utensil.prototype.name = ""; //String
Utensil.prototype.id = ""; //String
Utensil.prototype.image = ""; //Path

function Utensil(config){
	this.name = config['name'];
	this.width = parseFloat(config['width']);
	this.height = parseFloat(config['height']);
	this.id = config['id'];
	this.image = config['image'];
	this.alignment = config['alignment'];
	this.draggable = config['draggable'];
	this.droppable = config['droppable'];
	this.stack = config['stack'];
	this.state = config['state'];
	this.action = config['action'];
}

Utensil.prototype.getScaledWidth = function(){
	var scaled = (90.0 / 400.0) * (this.width);
	//console.log('getScaledWidth = ' + scaled);
	return scaled;
}

Utensil.prototype.getScaledHeight = function(){
	var scaled = (90.0 / 400.0) * (this.height);
	//console.log('getScaledHeight = ' + scaled);
	return scaled;
}

Utensil.prototype.getClasses = function(){
	var classes = "utensil";
	classes += " " + this.id + "-" + this.state;
	return classes;
}

Utensil.prototype.getMargin = function(side){
	if(side == 'top'){
		return 0;
	}
	else{
		switch(this.alignment){
			case 'center':
				return (90 - this.getScaledWidth()) / 2.0;
				break;
			case 'right':
				return (90 - this.getScaledWidth());
				break;
			default:
				alert('ERROR: Alignment not Defined: See Utensil.js, Utensil.getMargin()');
		}
	}
}

Utensil.prototype.toHTML = function(){
	var html = '';
	html += '<div class="' + this.getClasses() + '" ';
	html += 'id="' + this.id + '" ';
	html += 'style="width: ' + this.getScaledWidth() + 'vw;';
	html += 'z-index: ' + this.stack + ';';
	html += 'height: ' + this.getScaledHeight() + 'vw;';
	html += 'margin-top: ' + this.getMargin('top') + 'vw;';
	html += 'margin-left: ' + this.getMargin('left') + 'vw;';
	if(this.state === 'static'){
		html += 'background-image: url(' + this.image + ')"';
	}
	else{
		html += '"';
	}
	html += 'onclick="utensilAction(&quot;' + this.action + '&quot;, this);">';
	html += '<span class="label">' + this.name + '</span>';
	html += '</div>';
	//console.log(html)
	return html;
}

/*--------------------------------------------*/
/*---> ACTIONS <------------------------------*/
/*--------------------------------------------*/

function utensilAction(action, utensil, extraArgs){
	//console.log(utensil);
	switch(action){
		case 'rinse':
			faucetRinse(utensil);
			break;
		case 'shake':
			shakeBowl(utensil);
			break;
		case 'fill':
			fillBowl(utensil, extraArgs);
			break;
		default:
			alert('ERROR: Utensil Action Not Found.');
	}
}

function faucetRinse(utensil){

	function toggleFaucet(){
		if($('#' + utensil.id).hasClass('faucet-on')){
			$('#' + utensil.id).removeClass('faucet-on');
			$('#' + utensil.id).addClass('faucet-off');
		}
		else{
			$('#' + utensil.id).removeClass('faucet-off');
			$('#' + utensil.id).addClass('faucet-on');
		}
	}

	var runningWater = new Howl({
		urls: ['style/sound/runningwater.wav']
	}).play();

	var rinse = 0;
	var intervalID = setInterval(function(){
		setTimeout(function(){
			toggleFaucet();
			rinse++;
		}, 250);
		if(rinse > 15){
			clearInterval(intervalID);
			runningWater.stop();
		}
	}, 250);

}

function shakeBowl(utensil){
	var shake = new Howl({
		urls: ['style/sound/shake.mp3']
	}).play();
	setTimeout(function(){
		shake.stop();
	}, 2000);
	//console.log(utensil.id);
	registerDroppable(utensil.id);
}

function excludeTag(htmlBlob, exclusion, exclude){
	var size = htmlBlob.length;
	var startRecording = false;
	var countdown = exclusion.length;
	var excluded = ""
	var output = "";
	for(var c = 0; c < size; c++){
		if(!startRecording){
			excluded += htmlBlob.charAt(c);
			var tag = "";
				tag = htmlBlob.charAt(c);
			var tagLength = exclusion.length;
			for(var i = 1; i < tagLength; i++) {
				tag += htmlBlob.charAt(c+i);
			}
			console.log(tag);
			if(tag === exclusion){
				startRecording = true;
			}
		}
		else{
			if(countdown <= 0){
				output += htmlBlob.charAt(c);
			}
			else{
				excluded += htmlBlob.charAt(c);
				countdown--;
			}
		}
	}
	var response = exclude ? output : excluded;
	//alert(response)
	return response;
}

function fillBowl(utensil, extraArgs){
	var squirt = new Howl({
		urls: ['style/sound/squirt.mp3']
	}).play();
	setTimeout(function(){
		squirt.stop();
	}, 2000);
	console.log(utensil)
	console.log(extraArgs)
	var fillings = excludeTag(extraArgs, '/span', true);
	utensil.append(fillings);
}