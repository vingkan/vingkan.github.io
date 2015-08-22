function solve(){
	outStream("Start solution sequence.\n---");
	outStream("---\nPsych. Solve feature currently in development.");
}

function solveCross(){
	var face = 'up';
	var faceColor = cube.getFaceColor(face);
	var borders = cube.getBorders(face);
	var borderColors = cube.getBorderColors(face);
	for(var b = 0; b < borders.length; b++){
		var focus = cube.findByColors('edge', [faceColor, borderColors[b]]);
		while(!focus.hasLabels([face, borders[b]], 0)){

		}
		while(!focus.hasLabels([face, borders[b]], 1)){

		}
		while(!focus.hasLabels([face, borders[b]], 2)){
			
		}
	}
}