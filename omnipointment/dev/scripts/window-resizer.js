/* 
 * RESPONSIVE SIZING WITH LESS.JS AND JQUERY
 * Lots of magic numbers going on down here...
 * Does it work on mobile?
 */

window.adjustToScreenSize = function(){

	function updateLessViewHeight(size){
		less.modifyVars({
			'@vh': size + "px"
		});
	}

	function getWindowDimensionLimit(){
		return ((window.innerWidth > window.innerHeight) ? window.innerHeight : window.innerWidth);
	}

	function updateWindowSizings(){
		var limitSize = getWindowDimensionLimit() * 0.9;
		//console.log(limitSize)
		var newVH = (limitSize / 100) * 2.5;
		//console.log("New VH: " + newVH)
		updateLessViewHeight(newVH);
	}

	$(window).resize(updateWindowSizings).resize();

}

adjustToScreenSize();