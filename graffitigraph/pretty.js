function collapseEntryText(){
	var entryDiv = document.getElementById('entry');
	var googleMap = document.getElementById('googleMap');
	entryDiv.style.width = "100vw";
	entryDiv.style.height = "10vh";
	googleMap.style.marginTop = "10vh";
	googleMap.style.height = "90vh";
	$('#entry').removeClass('floatingHeader');
	$('#entry').addClass('miniHeader');
}