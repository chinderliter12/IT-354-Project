var myApp = angular.module('myBigApp', []);

myApp.controller('handleEvents', ['$scope', '$http', function ($scope, $http) {

    const API_URL = "http://localhost:5001/api";

    // data models
    $scope.loginData = {};
    $scope.register = {};
    $scope.appointment = {};
    $scope.appointments = [];
    $scope.courses = [];
    $scope.availability = [];
    $scope.users = [];
    $scope.userRole = 'guest';
    $scope.headerString = '../subviews/guestHeader.html';
    $scope.logName = '';

    $scope.newCourse = {};
    $scope.tutorAppointments = [];

    // admin availability
    $scope.tutorAvailability = [];
    $scope.selectedTutorAvailability = {};

    // prevent double booking
    $scope.isBooking = false;

    // time slots
    $scope.slots = [
        { label: "9:00 - 10:00", value: "9:00-10:00" },
        { label: "10:00 - 11:00", value: "10:00-11:00" },
        { label: "11:00 - 12:00", value: "11:00-12:00" },
        { label: "1:00 - 2:00", value: "1:00-2:00" },
        { label: "2:00 - 3:00", value: "2:00-3:00" }
    ];

    // auth token setup
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
        $http.defaults.headers.common.Authorization = `Bearer ${savedToken}`;
    }

    // date limits
    let today = new Date();
    $scope.today = today.toISOString().split("T")[0];

    let max = new Date();
    max.setDate(max.getDate() + 21);
    $scope.maxDate = max.toISOString().split("T")[0];

    // header logic
    $scope.determineHeader = function () {
        const role = localStorage.getItem("role") || 'guest';
        const name = localStorage.getItem("name") || '';

        $scope.logName = name;
        $scope.userRole = role;

        if(role == 'admin') {
            $scope.headerString = '../subviews/adminHeader.html';
        } else if (role == 'tutor') {
            $scope.headerString = '../subviews/tutorHeader.html';
        } else if (role == 'student') {
            $scope.headerString = '../subviews/studentHeader.html';
        } else {
            $scope.headerString = '../subviews/guestHeader.html';
        }
    };

    // auth
    $scope.loginUser = function () {

        $http.post(`${API_URL}/auth/login`, $scope.loginData)
            .then(res => {

                localStorage.setItem("token", res.data.token);
                localStorage.setItem("userId", res.data.user.id);
                localStorage.setItem("role", res.data.user.role);
                localStorage.setItem("name", res.data.user.name);

                $scope.logName = res.data.user.name;

                $http.defaults.headers.common.Authorization =
                    `Bearer ${res.data.token}`;

                $scope.determineHeader();

                alert("Login successful!");

                window.location.href = "/views/homePage.html";
            })
            .catch(err => {
                console.error(err);
                alert(err.data?.message || "Login failed");
            });
    };

    $scope.logoutUser = function() {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.removeItem("name");

        $scope.determineHeader();

        delete $http.defaults.headers.common.Authorization;
        window.location.href = "/views/homePage.html";
    };

    // users (admin)
    $scope.getUsers = function () {
        const token = localStorage.getItem("token");

        $http.get(`${API_URL}/users`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => {
            $scope.users = res.data;
        })
        .catch(err => console.error("GET USERS ERROR:", err));
    };

    $scope.addUser = function () {

        const newUser = {
            name: document.getElementById("userName").value,
            username: document.getElementById("userUsername").value,
            email: document.getElementById("userEmail").value,
            password: document.getElementById("userPass").value || "redbirds123",
            role: document.getElementById("userRole").value,
            active: true
        };

        const token = localStorage.getItem("token");

        $http.post(`${API_URL}/users`, newUser, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => {
            $scope.getUsers();
            alert("User created successfully");
        })
        .catch(err => {
            console.error("CREATE USER ERROR:", err);
            alert(err.data?.message || "Failed to create user");
        });
    };

    // courses
    $scope.createCourse = function () {

        const token = localStorage.getItem("token");

        $http.post(`${API_URL}/courses`, $scope.newCourse, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => {
            alert("course created!");
            $scope.newCourse = {};
            $scope.getCourses();
        })
        .catch(err => console.error(err));
    };

    $scope.getCourses = function () {
        $http.get(`${API_URL}/courses`)
            .then(res => {
                $scope.courses = res.data;
            })
            .catch(err => console.error(err));
    };

    // booking
    $scope.setBooking = function(course) {
        $scope.appointment.tutorName = course.tutor?._id || course.tutor;
        $scope.appointment.courseName = course.name;
    };

    $scope.bookAppointment = function () {

        if ($scope.isBooking) return;
        $scope.isBooking = true;

        const token = localStorage.getItem("token");

        if (!token) {
            alert("you must be logged in");
            $scope.isBooking = false;
            return;
        }

        if (!$scope.appointment.date || !$scope.appointment.slot) {
            alert("select date and time slot");
            $scope.isBooking = false;
            return;
        }

        let times = $scope.appointment.slot.split("-");

        const data = {
            tutor: $scope.appointment.tutorName,
            course: $scope.appointment.courseName,
            date: $scope.appointment.date,
            startTime: times[0],
            endTime: times[1]
        };

        $http.post(`${API_URL}/appointments`, data, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => {
            alert("appointment booked!");
            $scope.getMyAppointments();
        })
        .catch(err => {
            console.error(err);
            alert(err.data?.message || "booking failed");
        })
        .finally(() => {
            $scope.isBooking = false;
        });
    };

    $scope.getMyAppointments = function () {
        const token = localStorage.getItem("token");

        $http.get(`${API_URL}/appointments/my`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => {
            $scope.appointments = res.data;
        })
        .catch(err => console.error(err));
    };

    $scope.cancelAppointment = function(id) {
        const token = localStorage.getItem("token");

        $http.put(`${API_URL}/appointments/cancel/${id}`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(() => $scope.getMyAppointments())
        .catch(err => console.error(err));
    };

    $scope.getTutorAppointments = function () {

        const token = localStorage.getItem("token");
        if (!token) return;

        $http.get(`${API_URL}/appointments/tutor`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => {
            $scope.tutorAppointments = res.data;
        })
        .catch(err => console.error(err));
    };

    // admin availability system
    $scope.getAllAvailability = function () {
        const token = localStorage.getItem("token");

        $http.get(`${API_URL}/admin/availability`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => {
            $scope.tutorAvailability = res.data;
        })
        .catch(err => console.error("GET AVAILABILITY ERROR:", err));
    };

    $scope.assignTutorHours = function () {

        const token = localStorage.getItem("token");

        const data = {
            tutorId: $scope.selectedTutorAvailability.tutorId,
            day: $scope.selectedTutorAvailability.day,
            startTime: $scope.selectedTutorAvailability.startTime,
            endTime: $scope.selectedTutorAvailability.endTime
        };

        $http.post(`${API_URL}/admin/availability`, data, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => {
            alert("tutor hours assigned!");
            $scope.getAllAvailability();
        })
        .catch(err => {
            console.error(err);
            alert(err.data?.message || "failed to assign hours");
        });
    };

    $scope.deleteAvailability = function(id) {

        const token = localStorage.getItem("token");

        $http.delete(`${API_URL}/admin/availability/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(() => {
            $scope.getAllAvailability();
        })
        .catch(err => console.error(err));
    };

    // auto refresh (tutor)
    setInterval(function () {
        if ($scope.userRole === "tutor") {
            $scope.$apply(function () {
                $scope.getTutorAppointments();
            });
        }
    }, 30000);

    // initial loads
    $scope.getCourses();
    $scope.determineHeader();
    $scope.getMyAppointments();
    $scope.getUsers();
    $scope.getTutorAppointments();
    $scope.getAllAvailability();

}]);