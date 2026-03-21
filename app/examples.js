var appExamples = angular.module('myExamples', []);


//Controller for example data until we can get the database functions working
appExamples.controller('populateExamples', ['$scope', function($scope){
    
    $scope.exampleStudents = [
        {
            fName: "Anna",
            lName: "Welder",
            email: "awelde@ilstu.edu",
            role: "Student",
            active: true,
        },
        {
            fName: "James",
            lName: "Baxter",
            email: "jbaxte@ilstu.edu",
            role: "Student",
            active: true,
        }
    ]

    $scope.exampleTutors = [
        {
            fName: "Barry",
            lName: "Manning",
            email: "bmanni@ilstu.edu",
            role: "Tutor",
            active: true,
        },
        {
            fName: "Gerald",
            lName: "Wimble",
            email: "gwimbl@ilstu.edu",
            role: "Tutor",
            active: false,
        }
    ]

    $scope.exampleCourses = [
        {
            title: "IT168",
            startTime: "9:00 AM",
            endTime: "5:00PM"
        },
        {
            title: "IT179",
            startTime: "2:00 PM",
            endTime: "5:00PM"
        },
        {
            title: "IT180",
            startTime: "11:00 AM",
            endTime: "2:00PM"
        }
    ]
}]);
