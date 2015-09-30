var vinesh = document.getElementById('vinesh');
	/*vinesh.innerHTML = "Nick is picking up JavaScript fast!";
	vinesh.innerHTML += '<br><img src="style/putinmemes.jpg">';*/

var selectorVinesh = document.getElementById('selector-vinesh');

function vineshTree(){
	var tree = selectorVinesh.value;
	alert(tree);
}

var liList = document.getElementsByTagName('li');

for(var l = 0; l < liList.length; l++){
	console.log(liList[l]);
}