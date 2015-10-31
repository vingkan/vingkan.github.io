PrepSpace.prototype.name = ""; //String
PrepSpace.prototype.id = ""; //String
PrepSpace.prototype.image = ""; //Path

function PrepSpace(config){
	this.name = config['name'];
	this.id = config['id'];
	this.image = "'" + config['image'] + "'";
}

PrepSpace.prototype.toHTML = function(){
	var html = '';
	html += '<div class="location" ';
	html += 'id="' + this.id + '" ';
	html += 'style="background-image: url(' + this.image + ');"';
	html += '>';
	html += '<span class="label">' + this.name + '</span>';
	html += '</div>';
	return html;
}

function acceptDrops(targetID){
	$('#' + targetID).droppable({
		accept: '.ingredient',
		drop: function(event, ui){
			var dropID = $(ui.draggable).attr('id');
			$(ui.draggable).remove();
			var toDrop = getIngredient(dropID);
			$(this).append(toDrop.toHTML());
			$('#' + dropID).draggable();
			closeAllSideBars();
		}
	});
	console.log('enabled drops on: ' + targetID);
}