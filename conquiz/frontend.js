function openMenu(){
	$('.sidebar').removeClass('open');
	$('.sidebar').addClass('closed');
	var menu = $('#menuOptions');
	if(menu.hasClass('open')){
		menu.removeClass('open');
		menu.addClass('closed');
	}
	else{
		menu.addClass('open');
		menu.removeClass('closed');
		publicLog('Click a tower to add it to the map.');
	}
}

function toggleMenu(type){
	var presetTowers = $('#sidebar-' + type);
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