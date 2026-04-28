var myApp = angular.module('myBigApp', []);

myApp.controller('handleEvents', ['$scope', '$http', function ($scope, $http) {

    const API_URL = "http://localhost:5001/api";

    // DATA MODELS
    $scope.loginData = {};
    $scope.register = {};
    $scope.appointment = {};
    $scope.appointments = [];
    $scope.courses = [];

    // Timeslots
    $scope.slots = [
        { label: "9:00 - 10:00", value: "9:00-10:00" },
        { label: "10:00 - 11:00", value: "10:00-11:00" },
        { label: "11:00 - 12:00", value: "11:00-12:00" },
        { label: "1:00 - 2:00", value: "1:00-2:00" },
        { label: "2:00 - 3:00", value: "2:00-3:00" }
    ];

    // Token
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
        $http.defaults.headers.common.Authorization = `Bearer ${savedToken}`;
    }

    // Dates
    let today = new Date();
    $scope.today = today.toISOString().split("T")[0];

    let max = new Date();
    max.setDate(max.getDate() + 21);
    $scope.maxDate = max.toISOString().split("T")[0];

    // Users
    $scope.addUser = function () {
        const newUser = {
            name: document.getElementById("userName").value,
            username: document.getElementById("userUsername").value,
            email: document.getElementById("userEmail").value,
            password: "redbirds123",
            role: document.getElementById("userRole").value,
            active: true
        };

        $http.post(`${API_URL}/users`, newUser)
            .then(res => {
                console.log("User created:", res.data);
                $scope.getUsers();
            })
            .catch(err => console.error(err));
    };

    $scope.getUsers = function () {
        $http.get(`${API_URL}/users`)
            .then(res => {
                $scope.users = res.data;
            })
            .catch(err => console.error(err));
    };

    // Login
    $scope.loginUser = function () {

        $http.post(`${API_URL}/auth/login`, $scope.loginData)
            .then(res => {

                localStorage.setItem("token", res.data.token);
                localStorage.setItem("userId", res.data.user.id);
                localStorage.setItem("role", res.data.user.role);
                localStorage.setItem("name", res.data.user.name);

                alert("Login successful!");

                const role = res.data.user.role;

                if (role === "admin") {
                    window.location.href = "/views/adminDash.html";
                }
                else if (role === "tutor") {
                    window.location.href = "/views/tutorDashboard.html";
                }
                else {
                    window.location.href = "/views/hours.html";
                }

            })
            .catch(err => {
                console.error(err);
                alert(err.data?.message || "Login failed");
            });
    };

    // Register
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

    // Courses
    $scope.getCourses = function () {
        $http.get(`${API_URL}/courses`)
            .then(res => {
                $scope.courses = res.data;
            })
            .catch(err => console.error(err));
    };

    // Booking
    $scope.setBooking = function(course) {

        $scope.appointment.tutorId = course.tutor;

        console.log("COURSE:", course);
        console.log("APPOINTMENT:", $scope.appointment);

        $scope.bookAppointment();
    };

    $scope.bookAppointment = function () {

        const token = localStorage.getItem("token");

        if (!token) {
            alert("You must be logged in");
            return;
        }

        if (!$scope.appointment.date || !$scope.appointment.slot) {
            alert("Select date and time slot");
            return;
        }

        let times = $scope.appointment.slot.split("-");

        const data = {
            tutorId: $scope.appointment.tutorId,
            date: $scope.appointment.date,
            startTime: times[0],
            endTime: times[1]
        };

        console.log("BOOKING DATA:", data);

        $http.post(`${API_URL}/bookings`, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            alert("Appointment booked!");
            console.log(res.data);
        })
        .catch(err => {
            console.error(err);
            alert(err.data?.message || "Booking failed");
        });
    };


    $scope.getUsers();
    $scope.getCourses();

}]);