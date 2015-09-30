var treeList = document.getElementById('treeList');
var treeArray = ["Oak", "Birch", "Ivy"];
	treeArray.push("Basswood");
	treeArray.push("Chesnut");
	treeArray.push("Dogwood");

for(var t = 0; t < treeArray.length; t++){
	treeList.innerHTML += '<li>' + treeArray[t] + '</li>'
}