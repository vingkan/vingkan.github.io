function Point(x, y, color, radius){
	this.x = x;
	this.y = y;
	this.color = color || '#1A1A1A';
	this.radius = radius || 10;
	this.fill = false;
}

Point.prototype.toString = function(){
	return "Point at (" + this.x + ", " + this.y + ").";
}

Point.prototype.draw = function(){
	ctx.beginPath();
	ctx.strokeStyle = this.color;
	ctx.fillStyle = this.color;
	ctx.arc(this.x, this.y, this.radius, deg(0), deg(360), false);
	ctx.stroke();
	if(this.fill){
		ctx.fill();
	}
	ctx.closePath();
}

Point.prototype.drawIndex = function(index){
	var fontSize  = 15;
	var xOff = nameOffset(index + "", fontSize);
	var yOff = Math.round(fontSize / 3);
	ctx.font = fontSize + "px Open Sans";
	ctx.fillText(index, this.x - xOff, this.y + yOff);
}

Point.prototype.isDraggable = function(x, y){
	var draggable = false;
	//CHECK X BOUNDS
	var xBounds = false;
	var xLo = this.x - this.radius;
	var xHi = this.x + this.radius;
	if(x > xLo && x < xHi){
		xBounds = true;
	}
	//CHECK Y BOUNDS
	var yBounds = false;
	var yLo = this.y - this.radius;
	var yHi = this.y + this.radius;
	if(y > yLo && y < yHi){
		yBounds = true;
	}
	//FINAL CHECK
	if(xBounds && yBounds){
		draggable = true;
	}
	return draggable;
}

Point.prototype.openMenu = function(tempId){
	var pointMenu = document.getElementById('pointMenu');
		pointMenu.style.marginTop = (-435 + this.y) + 'px';
		pointMenu.style.marginLeft = (20 + this.x) + 'px';
		pointMenu.style.display = 'block';
	var forward = null;
		toolbar.forwardIndex = null;
		var forwardIndex = null;
	var backward = null;
		toolbar.backwardIndex = null;
		var backwardIndex = null;
	if(tempId > 0 && tempId < (toolbar.tempPoints.length-1)){
		forward = toolbar.tempPoints[tempId+1];
			forwardIndex = (tempId+1);
		backward = toolbar.tempPoints[tempId-1];
			backwardIndex = (tempId-1);
	}
	else if(tempId == 0){
		forward = toolbar.tempPoints[tempId+1];
			forwardIndex = (tempId+1);
		backward = toolbar.tempPoints[toolbar.tempPoints.length-1];
			backwardIndex = (toolbar.tempPoints.length-1);
	}
	else if(tempId == toolbar.tempPoints.length-1){
		forward = toolbar.tempPoints[0];
			forwardIndex = (0);
		backward = toolbar.tempPoints[tempId-1];
			backwardIndex = (tempId-1);
	}
	//SET
	forward.color = 'blue';
	forward.fill = true;
	toolbar.forwardIndex = forwardIndex;
	backward.color = 'yellow';
	backward.fill = true;
	toolbar.backwardIndex = backwardIndex;
	resetCanvas();
	toolbar.tempMap.draw();
	//RESET
	forward.color = '#1A1A1A';
	forward.fill = false;
	backward.color = '#1A1A1A';
	backward.fill = false;
	//DEFAULT TO MOVE POINT
	moveCurrent();
}