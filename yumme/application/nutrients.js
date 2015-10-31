
//var input = document.getElementById("textBox");
//var output = document.getElementById("output");
//// To get information from the food database you have to do two searches
//// The first search takes an string
//var apiKey = "WuhJZNLfyq9hTyTQpPAjUC3wYG5wA2hIfS01XOVl";
//
//var database = [];
//
//
//function findNutrient() {
//    $.getJSON("http://api.nal.usda.gov/ndb/search/?format=json&q=butter&sort=n&max=25&offset=0&api_key="+apiKey, function(data) {
//        //var obj = jQuery.parseJSON(data);
//        database = data['list']['item'];
//        $.each(data['list']['item'], function(i, obj) {
//            database.push();
//        });
//        //output.innerHTML += 
//    });
//}

var xCoordinate = document.getElementById("xCoordinate");
var yCoordinate = document.getElementById("yCoordinate");
var closest;

var database;

function nearestStore() {
    $.getJSON("https://data.cityofchicago.org/api/views/53t8-wyrc/rows.json", function(data) {
        database = data['data'];
    });
}

