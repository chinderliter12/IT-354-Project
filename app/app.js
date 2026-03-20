var myApp = angular.module('myBigApp', []);

//Function that will fire before the application runs
//For things like routing
//myBigApp.config(function(){});

//This function will fire as the application runs
//myBigApp.run(function(){});

//This function controls the data of the app
//The array is used to prevent issues with minification
myApp.controller('displayCourses', ['$scope', function($scope){

    $scope.message = "hello again!";
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
}]);

myApp.controller('checkCourses', ['$scope', function($scope){
    if(exampleCourses[0]==null) {
        return false;
    } else {
        return true;
    }
}])