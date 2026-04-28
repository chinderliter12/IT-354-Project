var myApp = angular.module('myBigApp', []);

myApp.controller('handleEvents', ['$scope', '$http', function ($scope, $http) {

    const API_URL = "http://localhost:5001/api";

    // Data models used by the view
    $scope.loginData = {};
    $scope.register = {};
    $scope.appointment = {};
    $scope.appointments = [];
    $scope.courses = [];

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

    // Add New Course
    $scope.addCourse = function () {

        const newCourse = {
            name: document.getElementById("name").value,
            tutor: document.getElementById("tutor").value,
            description: document.getElementById("desc").value
        };

        if (!newCourse.name || !newCourse.tutor || !newCourse.description) {
            return alert("All fields required");
        }

        $http.post(`${API_URL}/courses`, newCourse)
            .then(res => {
                console.log("COURSE CREATED:", res.data);

                document.getElementById("name").value = "";
                document.getElementById("tutor").value = "";
                document.getElementById("desc").value = "";

                 $scope.getCourses();
            })
            .catch(err => console.error(err));
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