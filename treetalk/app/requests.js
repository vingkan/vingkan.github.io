var treeURL = "https://data.illinois.gov/resource/dzge-uybj.json"
var appToken = "Le00VXF0GK0d8D1tTn2v6Vkpl";

var storage = new Storage();

function getTrees(id, query, limit){
	query['$$app_token'] = appToken;
	query['$limit'] = limit;
	$.ajax({
		url: treeURL,
		method: "GET",
		dataType: "json",
		data: query,
		success: function(data, status, jqxhr){
			console.log("Received tree data...");
			handleTreeData(id, data);
		},
		error: function(jqxhr, status, error){
			console.log("Critical Error. RIP.");
		}
	});
}

function handleTreeData(id, data){
	var newTrees = []
	for(var d = 0; d < data.length; d++){
		newTrees.push(new Tree(data[d]));
	}
	storage.add({
		'id': id,
		'data': newTrees
	});
	//console.log('...Finished parsing tree data.');
	//console.log(storage);
}

function getCount(id, tag, value){
	var query = {
		'$$app_token': appToken,
		'$select': 'count(' + tag + ')',
	}
	query[tag] = value;
	$.ajax({
		url: treeURL,
		method: "GET",
		dataType: "json",
		data: query,
		success: function(data, status, jqxhr){
			//console.log("Received count data...");
			var count = data[0]['count_' + tag];
			handleCountData(id, count);
		},
		error: function(jqxhr, status, error){
			console.log("Critical Error. RIP.");
		}
	});
}

function handleCountData(id, data){
	storage.add({
		'id': id,
		'data': data
	});
	//console.log('...Finished parsing count data.');
	//console.log(storage);
}

getTrees('a1', {
	"tree_species": "Acer rubrum"
}, 3);

getTrees('b1', {
	'$where': 'within_circle(location, 40.15, -88.25, 1000)'
}, 10);

getCount('c1', 'tree_species', 'Acer rubrum');