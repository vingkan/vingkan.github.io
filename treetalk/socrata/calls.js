console.log("Hello World");

//https://data.illinois.gov/Municipality/Trees-Owned-by-the-City-of-Champaign/dzge-uybj

var appToken = "Le00VXF0GK0d8D1tTn2v6Vkpl";

function sampleAjax(){
	$.ajax({
		url: "https://data.chattlibrary.org/resource/5na4-ggsr.json",
		method: "GET",
		dataType: "json",
		data: {
			"codedescription": "EMBEZZLEMENT",
			"$$app_token": appToken
		},
		success: function(data, status, jqxhr){
			console.log("Received: ", data);
		},
		error: function(jqxhr, status, error){
			console.log("Critical Error. RIP.");
		}
	});
}

var treesAPIUrl = "https://data.illinois.gov/resource/dzge-uybj.json";

function getTrees(){
	$.ajax({
		url: treesAPIUrl,
		method: "GET",
		dataType: "json",
		data: {
			"$limit": 5,
			"tree_species": "Acer rubrum",
			"$$app_token": appToken
		},
		success: function(data, status, jqxhr){
			console.log("Received: ", data);
			handleTreeData(data.data);
		},
		error: function(jqxhr, status, error){
			console.log("Critical Error. RIP.");
		}
	});
}

function handleTreeData(data){
	//8 references "tree_species"
	console.log(data[25][8]);
}

//Links and Documentation at End: A
function createRequestURL(baseUrl, query){
	var url = baseUrl;
	var queries = [];
		queries.push('$$app_token' + '=' + appToken);
	for(var tag in query){
		if(query.hasOwnProperty(tag)){
			queries.push(tag + '=' + query[tag]);
		}
	}
	url += '?' + queries.join('&');
	return url;
}

function getTreesWithLimit(){
	var query = {
		'$limit': 5,
		'$offset': 3
	}
	var request = createRequestURL(treesAPIUrl, query);
	console.log(request);
}

//ENDNOTES

/* Section A
* Use $.param(data) to convert simple tag queries to URLs: http://stackoverflow.com/questions/3308846/serialize-object-to-query-string-in-javascript-jquery
* Loop Over JSON Tags: http://stackoverflow.com/questions/10352840/loop-through-json-object
*/