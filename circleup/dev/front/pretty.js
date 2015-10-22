function initScrollingHeader(){
	window.addEventListener('scroll', function(event){
		var distanceY = window.pageYOffset || document.documentElement.scrollTop,
			shrinkOn = 50,
			header = document.querySelector("header");
		if(distanceY > shrinkOn){
			classie.add(header, "smaller");
		}
		else{
			if(classie.has(header, "smaller")){
				classie.remove(header, "smaller");
			}
		}
	});
}

window.onload = initScrollingHeader();