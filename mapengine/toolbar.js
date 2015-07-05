function Toolbar(){
	this.tempMap = map;
	this.tempPoints = [];
	this.moving = false;
	this.forwardIndex = null;
	this.backwardIndex = null;
	this.showGrid = true;
	this.showNumbers = true;
}

Toolbar.prototype.pushTempPoint = function(point){
	this.tempPoints.push(point);
}

Toolbar.prototype.pushCountryPoints = function(country){
	for(var i = 0; i < country.points.length; i++){
		this.pushTempPoint(country.points[i]);
	}
}

Toolbar.prototype.checkContact = function(x, y){
	var contact = false;
	for(var i = 0; i < this.tempPoints.length; i++){
		if(this.tempPoints[i].isDraggable(x, y)){
			contact = true;
			resetPointMenu();
			var currentIndex = document.getElementById('current-index');
				currentIndex.value = i;
			this.tempPoints[i].openMenu(i);
			break;
		}
	}
	return contact;
}

function resetPointMenu(){
	var pointMenu = document.getElementById('pointMenu');
		pointMenu.style.marginTop = '-435px';
		pointMenu.style.marginLeft = '20px';
		pointMenu.style.display = 'none';
}

function viewCountry(){
	var index = document.getElementById('country-select').value;
	var name = document.getElementById('country-name');
	var color = document.getElementById('country-color');
	var delKey = document.getElementById('country-delete');
	if(index == -1){
		resetCanvas();
		map.draw();
		name.value = "";
		color.value = "#000000";
		name.style.display = 'none';
		color.style.display = 'none';
		delKey.style.display = 'none';
	}
	else{
		var country = map.getCountryByIndex(index);
		toolbar.tempMap = new CanvasMap('map', [country], true);
			toolbar.tempPoints = [];
		toolbar.pushCountryPoints(country);
		resetCanvas();
		toolbar.tempMap.draw();
		name.value = country.name;
		color.value = country.color;
		name.style.display = 'inline-block';
		color.style.display = 'inline-block';
		delKey.style.display = 'inline-block';
	}
}

function updateCurrentCountry(){
	var index = document.getElementById('country-select').value;
	var name = document.getElementById('country-name');
	var color = document.getElementById('country-color');
	var country = map.getCountryByIndex(index);
		country.name = name.value;
		country.color = color.value;
	map.loadOptions();
		document.getElementById('country-select').value = index;
	outClick();
}

function deleteCountry(){
	var index = document.getElementById('country-select').value;
	if(index != -1){
		map.countries.splice(index, 1);
		map.loadOptions();
		toolbar.moving = false;
		//CUT FROM OUTCLICK --- toolbar.tempMap.countries[0].points = toolbar.tempPoints;
		resetCanvas();
		map.draw();
		resetPointMenu();
	}
	if(map.countries.length == 0){
		updateGrid();
	}
}

function newCountry(inputName, inputColor){
	var name = inputName || "New Country";
	var color = inputColor || "#000000"
	map.pushCountry(new Country(name, color));
	map.loadOptions();
	var selector = document.getElementById('country-select');
		selector.value = (map.countries.length-1);
		viewCountry((map.countries.length-1));
	return (map.countries.length-1);
}

function showAllCountries(){
	var selector = document.getElementById('country-select');
		selector.value = -1;
	viewCountry();
}

function outClick(){
	toolbar.moving = false;
	toolbar.tempMap.countries[0].points = toolbar.tempPoints;
	resetCanvas();
	toolbar.tempMap.draw();
	resetPointMenu();
}

function moveCurrent(){
	toolbar.moving = true;
}

function removeCurrent(){
	toolbar.moving = false;
	var currentIndex = document.getElementById('current-index').value;
	toolbar.tempPoints.splice(currentIndex, 1);
	outClick();
}

function forwardCurrent(forward){
	toolbar.moving = false;
	var currentIndex = document.getElementById('current-index').value;
	if(forward){
		swapItems(toolbar.tempPoints, currentIndex, toolbar.forwardIndex);
	}
	else if(!forward){
		swapItems(toolbar.tempPoints, currentIndex, toolbar.backwardIndex);
	}
	outClick();
}

function toggleGrid(){
	if(toolbar.showGrid){
		if(toolbar.showNumbers){
			toolbar.showGrid = false;
			toolbar.showNumbers = false;
		}
		else{
			toolbar.showNumbers = true;
		}
	}
	else{
		toolbar.showGrid = true;
	}
	resetCanvas();
	map.draw();
}