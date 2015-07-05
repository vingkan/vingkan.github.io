function Country(name, color, pointsArray){
	this.name = name;
	this.color = color || "#000000";
	this.points = pointsArray || [];
}

Country.prototype.containsPoint = function(point){
	var duplicate = false;
	for(var i = 0; i < this.points.length; i++){
		if(this.points[i].x == point.x && this.points[i].y == point.y){
			duplicate = true;
		}
	}
	return duplicate;
}

Country.prototype.pushPoint = function(point){
	var duplicate = this.containsPoint(point);
	if(!duplicate){
		this.points.push(point);
	}
}

Country.prototype.showPoints = function(){
	for(var i = 0; i < this.points.length; i++){
		this.points[i].draw();
		this.points[i].drawIndex(i);
	}
}

function nameOffset(name, fontSize){
	return Math.round((name.length * (fontSize / 2)) / 2);
}

Country.prototype.placeName = function(ctx, visible){
	var xSum = 0;
	var ySum = 0;
	for(var i = 0; i < this.points.length; i++){
		xSum += this.points[i].x;
		ySum += this.points[i].y;
	}
	var xLoc = Math.round(xSum / this.points.length);
	var yLoc = Math.round(ySum / this.points.length);
	ctx.fillStyle = "white";
	var fontSize = 15;
	var xOff = nameOffset(this.name, fontSize);
	var yOff = Math.round(fontSize / 2);
	ctx.font = fontSize + "px Open Sans";
	ctx.fillText(this.name, xLoc - xOff, yLoc + yOff);
}

Country.prototype.draw = function(){
	if(this.points.length > 0){
		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.moveTo(this.points[0].x, this.points[0].y);
		for(var i = 1; i < this.points.length; i++){
			ctx.lineTo(this.points[i].x, this.points[i].y);
		}
		ctx.lineTo(this.points[0].x, this.points[0].y);
		ctx.fill();
		//ctx.stroke();
		ctx.closePath();
		this.placeName(ctx, true);
	}
}