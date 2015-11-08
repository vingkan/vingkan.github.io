function toggleMenu(){
	var presetTowers = $('#sidebar-towers');
	if(presetTowers.hasClass('open')){
		presetTowers.removeClass('open');
		presetTowers.addClass('closed');
	}
	else{
		presetTowers.addClass('open');
		presetTowers.removeClass('closed');
		publicLog('Click a tower to add it to the map.');
	}
}

function publicLog(message){
	var log = document.getElementById('public-log');
	log.value = message;
}

console.log('LOADED FRONTEND');