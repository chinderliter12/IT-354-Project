<script src="auth.js"></script>
var myApp = angular.module('myBigApp', []);

//Function that will fire before the application runs
//For things like routing
//myBigApp.config(function(){});

//This function will fire as the application runs
//myBigApp.run(function(){});

myApp.controller('handleEvents', ['$scope', function($scope){

    $scope.exampleCourses= [
        {
            name: "IT168", 
            timeSlots: [ {
                start: "11:00AM",
                end: "5:00PM"
            }, {
                
            }]
        }, {
            name: "IT179",
            numTutors: 1,
            open: false
        }, {
            name: "IT180",
            numTutors: 1,
            open: true
        }];

    $scope.requestSignOn = function(email, password) {
        //Send login information to database here
    }

}]);