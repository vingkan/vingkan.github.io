function closeAllSideBars(){
	var sidebars = document.getElementsByClassName('sidebar');
	var size = sidebars.length;
	for(var s = 0; s < size; s++){
		toggleSideBar(sidebars[s].id, true);
	}
}

function toggleSideBar(sideBarID, forceClose){
	toggleMenu('options', true);
	var sideBar = $('#' + sideBarID);
	var menu = $('#openMenu');
	if(forceClose){
		sideBar.removeClass('sidebar-open');
		sideBar.addClass('sidebar-close');
		menu.removeClass('button-right');
		menu.addClass('button-left');
	}
	else{
		if(sideBar.hasClass('sidebar-open')){
			sideBar.removeClass('sidebar-open');
			sideBar.addClass('sidebar-close');
			menu.removeClass('button-right');
			menu.addClass('button-left');
		}
		else{
			sideBar.removeClass('sidebar-close');
			sideBar.addClass('sidebar-open');
			menu.removeClass('button-left');
			menu.addClass('button-right');
		}
	}
}

function toggleShade(open){
	var shade = $('#shade');
	if(open){
		shade.removeClass('shade-off');
		shade.addClass('shade-on');
	}
	else{
		shade.removeClass('shade-on');
		shade.addClass('shade-off');
	}
}

function toggleMenu(menuID, forceClose){
	var menu = $('#' + menuID);
	if(forceClose){
		menu.removeClass('options-open');
		menu.addClass('options-close');
		toggleShade(false);
	}
	else{
		if(menu.hasClass('options-open')){
			menu.removeClass('options-open');
			menu.addClass('options-close');
			toggleShade(false);
		}
		else{
			menu.removeClass('options-close');
			menu.addClass('options-open');
			toggleShade(true);
		}
	}
	enableDrags();
	enableDrops();
}

var draggables = [];

function registerDraggable(ingredientID){
	draggables.push(ingredientID);
}

function enableDrags(){
	var size = draggables.length;
	var ingredientID = "INITIAL";
	for(var d = 0; d < size; d++){
		ingredientID = draggables[d];
		$('#' + ingredientID).draggable();
		//console.log('draggable: ' + '#' + ingredientID);
		//console.log($('#' + ingredientID));
	}
	//console.log("Enable All Drags!");
}

var droppables = [];

function registerDroppable(ingredientID){
	droppables.push(ingredientID);
}

function enableDrops(){
	var size = droppables.length;
	var ingredientID = "INITIAL";
	for(var d = 0; d < size; d++){
		ingredientID = droppables[d];
		
		acceptDrops(ingredientID, '.ingredient, .utensil');
	}
	//console.log("Enable All Drops!");
}

function acceptDrops(targetID, classes){
	$('#' + targetID).droppable({
		accept: classes,
		drop: function(event, ui){
			//console.log($(ui.draggable).hasClass('utensil'))
			if($(ui.draggable).hasClass('ingredient')){
				var dropID = $(ui.draggable).attr('id');
				$(ui.draggable).remove();
				var toDrop = getIngredient(dropID);
				var isUtensil = $('#' + targetID).hasClass('utensil');
				if(toDrop.squirt && isUtensil){
					$(this).append(toDrop.toSquirt());
				}
				else{
					$(this).append(toDrop.toHTML());
				}
				$('#' + dropID).draggable();
			}
			else if($(ui.draggable).hasClass('utensil')){
				utensilAction('fill', $('#' + targetID), ui.draggable.html());
				/*var label = excludeTag(ui.draggable.html(), '/span', false);
				var fillings = excludeTag(ui.draggable.html(), '/span', true)
				if(fillings.length > 5){
					ui.draggable.empty();
					ui.draggable.append(label);
				}*/
			}
			closeAllSideBars();
		}
	});
	//console.log('enabled drops on: ' + targetID);
}