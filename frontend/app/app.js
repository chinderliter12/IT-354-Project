var myApp = angular.module('myBigApp', []);

myApp.controller('handleEvents', ['$scope', '$http', function ($scope, $http) {

    const API_URL = "http://localhost:5001/api";

    // Data models used by the view
    $scope.loginData = {};
    $scope.register = {};
    $scope.appointment = {};
    $scope.appointments = [];
    $scope.courses = [];

    $scope.test = function () {
        console.log("Angular is working");
        alert("Angular is connected!");
    };

    // Login user and store JWT + user info
    $scope.loginUser = function () {

        $http.post(`${API_URL}/auth/login`, $scope.loginData)
            .then(res => {

                localStorage.setItem("token", res.data.token);
                localStorage.setItem("userId", res.data.user.id);
                localStorage.setItem("role", res.data.user.role);
                localStorage.setItem("name", res.data.user.name);

                alert("Login successful!");

                $scope.getAppointments();

            })
            .catch(err => {
                console.error(err);
                alert(err.data?.message || "Login failed");
            });
    };

    // Register new user
    $scope.registerUser = function () {

        $http.post(`${API_URL}/auth/register`, $scope.register)
            .then(res => {

                alert("Registration successful!");
                $scope.register = {};

            })
            .catch(err => {
                console.error(err);
                alert(err.data?.message || "Registration failed");
            });
    };

    // Fetch all courses
    $scope.getCourses = function () {

        $http.get(`${API_URL}/courses`)
            .then(res => {
                $scope.courses = res.data;
            })
            .catch(err => console.error(err));
    };

    // Create a new appointment 
    $scope.bookAppointment = function () {

        const token = localStorage.getItem("token");

        if (!token) {
            return alert("You must be logged in to book");
        }

        $http.post(`${API_URL}/appointments`, $scope.appointment, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {

            alert("Appointment booked!");

            $scope.appointment = {};
            $scope.getAppointments();

        })
        .catch(err => {
            console.error(err);
            alert(err.data?.message || "Booking failed");
        });
    };

    // Get logged-in user's appointments
    $scope.getAppointments = function () {

        const token = localStorage.getItem("token");

        if (!token) return;

        $http.get(`${API_URL}/appointments/my`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            $scope.appointments = res.data;
        })
        .catch(err => {
            console.error(err);
        });
    };

    // Cancel an appointment
    $scope.cancelAppointment = function (id) {

        const token = localStorage.getItem("token");

        if (!token) {
            return alert("Not logged in");
        }

        $http.put(`${API_URL}/appointments/cancel/${id}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {

            alert("Appointment cancelled");

            $scope.getAppointments();

        })
        .catch(err => {
            console.error(err);
            alert(err.data?.message || "Cancel failed");
        });
    };

    // Initial data load
    $scope.getCourses();
    $scope.getAppointments();

}]);