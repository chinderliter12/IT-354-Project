myApp.controller('handleEvents', ['$scope', '$http', function($scope, $http){

    $scope.exampleCourses = [
        { name: "IT168", timeSlots: [ { start: "11:00AM", end: "5:00PM" } ] },
        { name: "IT179", numTutors: 1, open: false },
        { name: "IT180", numTutors: 1, open: true }
    ];

    // Backend URL
    const API_URL = "http://localhost:5000/api";

    // LOGIN
    $scope.requestSignOn = function(email, password) {
        $http.post(`${API_URL}/auth/login`, { email, password })
        .then(function(response){
            console.log("Login success:", response.data);
            // Save token for future requests
            localStorage.setItem('token', response.data.token);
        })
        .catch(function(error){
            console.error("Login error:", error.data);
        });
    }

    // REGISTER
    $scope.registerUser = function(name, username, email, password) {
        $http.post(`${API_URL}/auth/register`, { name, username, email, password })
        .then(function(response){
            console.log("Registration success:", response.data);
        })
        .catch(function(error){
            console.error("Registration error:", error.data);
        });
    }

    // CREATE BOOKING
    $scope.createBooking = function(bookingData) {
        const token = localStorage.getItem('token');
        $http.post(`${API_URL}/booking`, bookingData, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(function(response){
            console.log("Booking created:", response.data);
        })
        .catch(function(error){
            console.error("Booking error:", error.data);
        });
    }

    // GET BOOKINGS
    $scope.getBookings = function() {
        const token = localStorage.getItem('token');
        $http.get(`${API_URL}/booking`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(function(response){
            console.log("Bookings:", response.data);
        })
        .catch(function(error){
            console.error("Get bookings error:", error.data);
        });
    }

}]);
