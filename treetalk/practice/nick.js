var nick = document.getElementById("nick"); // refers to the div tag with nick
var selectorNick = document.getElementById("selector-nick");

//nick.innerHTML = "I like trees";// refers to spaces between div tag
//nick.innerHTML += '<br><img src="style/tree.gif">'; // injects html tags onto 

function nickTree(){
	var tree = selectorNick.value;
	alert(tree); // create a popup with string parameters
}

var treeList = document.getElementsByTagName("li"); // finds the list in script.js

for (var i = 0; i < treeList.length; i++) {
	console.log(treeList[i]);
}

// small error below
var options = document.createElement('option'); // create a option tag element
for (var i = 0; i < treeList.length; i++) { // loop through the treelist in script.js
	options.appendChild(treeList[i]); // append each of the names in treeList
	options.value += treeList[i]; // set the values of option to match the option
	selectorNick.appendChild(options); // add options to selectorNick
}

