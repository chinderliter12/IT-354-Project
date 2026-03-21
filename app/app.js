var myApp = angular.module('myBigApp', []);

myApp.controller('adminHelper', ['$scope', function($scope){

    $scope.exampleStudents = function() {
        studentsArr = [
            {
                fName: "John",
                lName: "Smith",
                email: "jsmith@ilstu.edu"
            }
        ]
    }

    $scope.exampleTutors = function() {
        tutorsArr = [
            {
                fName: "Wendell",
                lName: "Grayson",
                email: "wgrays@ilstu.edu"
                
            }
        ]
    }
}])

myApp.controller('handleEvents', ['$scope', '$http', function($scope, $http){
    const API_URL = "http://localhost:5000/api";

    // ---------- REGISTER ----------
    $scope.registerUser = function(name, username, email, password) {
        $http.post(`${API_URL}/auth/register`, { name, username, email, password })
        .then(res => {
            console.log("User registered");
            alert("Registration successful! Please login.");
        })
        .catch(err => console.error(err.data));
    }

    // ---------- LOGIN ----------
    $scope.loginUser = function(email, password) {
        $http.post(`${API_URL}/auth/login`, { email, password })
        .then(res => {
            const token = res.data.token;
            localStorage.setItem('token', token); // save token
            console.log("Login successful, token saved");
            alert("Logged in!");
        })
        .catch(err => {
            console.error(err.data);
            alert("Login failed: " + err.data.message);
        });
    }

    // ---------- CREATE BOOKING ----------
    $scope.createBooking = function() {
        const token = localStorage.getItem('token');
        if(!token) return alert("You must be logged in to create a booking");

        const bookingData = {
            studentName: $scope.booking.studentName,
            studentEmail: $scope.booking.studentEmail,
            tutorName: $scope.booking.tutorName,
            subject: $scope.booking.subject,
            date: $scope.booking.date,
            startTime: $scope.booking.startTime,
            endTime: $scope.booking.endTime,
            description: $scope.booking.description
        };

        $http.post(`${API_URL}/booking`, bookingData, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => {
            console.log("Booking created:", res.data.booking);
            alert("Booking created!");
            $scope.getBookings(); // refresh list
        })
        .catch(err => {
            console.error(err.data);
            alert("Booking failed: " + err.data.error);
        });
    }

    // ---------- GET BOOKINGS ----------
    $scope.getBookings = function() {
        const token = localStorage.getItem('token');
        if(!token) return; // not logged in

        $http.get(`${API_URL}/booking`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => {
            $scope.bookings = res.data;
        })
        .catch(err => console.error(err.data));
    }

    // Call this on page load to fetch bookings if logged in
    $scope.getBookings();
}]);
