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
	this.state = config['state'];
	this.action = config['action'];
}

Utensil.prototype.getScaledWidth = function(){
	var scaled = (90.0 / 400.0) * (this.width);
	console.log('getScaledWidth = ' + scaled);
	return scaled;
}

Utensil.prototype.getScaledHeight = function(){
	var scaled = (90.0 / 400.0) * (this.height);
	console.log('getScaledHeight = ' + scaled);
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
		if(this.alignment === 'center'){
			return (90 - this.getScaledWidth()) / 2.0;
		}
		else{
			alert('ERROR: Alignment not Defined: See Utensil.js, Utensil.getMargin()');
		}
	}
}

Utensil.prototype.toHTML = function(){
	var html = '';
	html += '<div class="' + this.getClasses() + '" ';
	html += 'id="' + this.id + '" ';
	html += 'style="width: ' + this.getScaledWidth() + 'vw;';
	html += 'height: ' + this.getScaledHeight() + 'vw;';
	html += 'margin-top: ' + this.getMargin('top') + 'vw;';
	html += 'margin-left: ' + this.getMargin('left') + 'vw;';
	//html += 'background-image: url(' + this.image + ');
	html += '"';
	html += 'onclick=utensilAction(&quot;' + this.action + '&quot;);>';
	html += '<span class="label">' + this.name + '</span>';
	html += '</div>';
	console.log(html)
	return html;
}

/*--------------------------------------------*/
/*---> ACTIONS <------------------------------*/
/*--------------------------------------------*/

function utensilAction(action){
	switch(action){
		case 'rinse':
			faucetRinse();
			break;
		default:
			alert('ERROR: Utensil Action Not Found.');
	}
}

function faucetRinse(){

	var faucet = document.getElementById('faucet');

	function toggleFaucet(){
		if($('#faucet').hasClass('faucet-on')){
			$('#faucet').removeClass('faucet-on');
			$('#faucet').addClass('faucet-off');
		}
		else{
			$('#faucet').removeClass('faucet-off');
			$('#faucet').addClass('faucet-on');
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
		if(rinse > 20){
			clearInterval(intervalID);
			runningWater.stop();
		}
	}, 250);

}