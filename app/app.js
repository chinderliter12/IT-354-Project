var myApp = angular.module('myBigApp', []);

myApp.controller('handleEvents', ['$scope', '$http', function($scope, $http){
    const API_URL = "http://localhost:5000/api";

    // Object to hold login info
    $scope.loginData = {};

    // ---------- LOGIN ----------
    $scope.loginUser = function() {
        const { email, password } = $scope.loginData;

        if(!email || !password) return alert("Please enter email and password");

        $http.post(`${API_URL}/auth/login`, { email, password })
        .then(res => {
            const token = res.data.token;
            if(!token) return alert("Login failed: no token returned");

            localStorage.setItem('token', token); // save token
            console.log("Login successful, token saved:", token);
            alert("Logged in successfully!");
        })
        .catch(err => {
            console.error(err.data);
            alert("Login failed: " + (err.data.message || "Unknown error"));
        });
    }

    // ---------- REGISTER ----------
    $scope.registerUser = function(name, username, email, password) {
        $http.post(`${API_URL}/auth/register`, { name, username, email, password })
        .then(res => {
            console.log("User registered");
            alert("Registration successful! Please login.");
        })
        .catch(err => console.error(err.data));
    }

    // ---------- BOOKING FUNCTIONS ----------
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
            $scope.getBookings();
        })
        .catch(err => {
            console.error(err.data);
            alert("Booking failed: " + err.data.error);
        });
    }

    $scope.getBookings = function() {
        const token = localStorage.getItem('token');
        if(!token) return;

        $http.get(`${API_URL}/booking`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => {
            $scope.bookings = res.data;
        })
        .catch(err => console.error(err.data));
    }

    // Load bookings on page load if logged in
    $scope.getBookings();
}])
