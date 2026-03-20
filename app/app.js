// app.js

var myApp = angular.module('myBigApp', []);

myApp.controller('handleEvents', ['$scope', function($scope){

    // Example Classes 
    $scope.exampleCourses = [
        {
            name: "IT168", 
            timeSlots: [
                { start: "11:00AM", end: "5:00PM" }
            ]
        },
        {
            name: "IT179",
            numTutors: 1,
            open: false
        },
        {
            name: "IT180",
            numTutors: 1,
            open: true
        }
    ];

    // Form fields (bound to HTML)
    $scope.userName = "";
    $scope.date = "";
    $scope.startTime = "";
    $scope.endTime = "";
    $scope.description = "";

    //  CREATE BOOKING FUNCTION
    $scope.createBooking = function() {

        const bookingData = {
            userName: $scope.userName,
            date: $scope.date,
            startTime: $scope.startTime,
            endTime: $scope.endTime,
            description: $scope.description
        };

        console.log("Sending booking:", bookingData);

        fetch('http://localhost:5000/api/booking', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookingData)
        })
        .then(response => response.json())
        .then(data => {
            console.log("Booking success:", data);
            alert("Booking created successfully!");

            // clear form after success
            $scope.$apply(() => {
                $scope.userName = "";
                $scope.date = "";
                $scope.startTime = "";
                $scope.endTime = "";
                $scope.description = "";
            });
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Booking failed.");
        });
    };

}]);
