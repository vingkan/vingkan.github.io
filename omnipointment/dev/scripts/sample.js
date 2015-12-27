var PATH = "https://omnipointment.firebaseio.com/";

var app = angular.module("omniApp", ["firebase"]);

app.controller("omniCtrl", ["$scope", "$firebaseArray",
	function($scope, $firebaseArray){

		var usersRef = new Firebase(PATH + "users/");
		//console.log(PATH + "users/")
		$scope.users = $firebaseArray(usersRef);

		var query = usersRef.orderByChild("google").limitToLast(10);
		$scope.filteredUsers = $firebaseArray(query);

		$scope.user = sessionStorage.user;

		$scope.name = sessionStorage.name;
		$scope.getName = function(){
			return $scope.name;
		}
	}
]);

function updateName(nameInput){
	sessionStorage.setItem('name', nameInput.value);
}

var unique = require('uniq');

var data = [1, 2, 2, 3, 4, 5, 5, 5, 6];

console.log(data)

console.log(unique(data));

console.log(data)

//var grunt = require('grunt');