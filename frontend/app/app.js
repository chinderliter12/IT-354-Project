var myApp = angular.module('myBigApp', []);

myApp.controller('adminFunctions', ['$scope', '$http', function ($scope, $http) {

    const API_URL = "http://localhost:5001/api";

    $scope.displayChoice = 'student';
    $scope.menuSelection = 'student';

    $scope.newCourse = {};
    $scope.users = [];
    $scope.tutorAvailability = [];
    $scope.selectedTutorAvailability = {};
    $scope.logs = [];

    $scope.adminDisplay = function(displayChoice) {
        $scope.menuSelection = displayChoice;

        if (displayChoice === 'logs') {
            $scope.getLogs();
        }
    };

    $scope.getLogs = function () {

        const token = localStorage.getItem("token");

        $http.get(`${API_URL}/logs`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => {
            $scope.logs = res.data;
        })
        .catch(err => console.error(err));
    };

    $scope.logAction = function(action, details) {

        const token = localStorage.getItem("token");

        const data = { action, details };

        $http.post(`${API_URL}/logs`, data, {
            headers: { Authorization: `Bearer ${token}` }
        }).catch(err => console.error(err));
    };

    $scope.getUsers = function () {
        const token = localStorage.getItem("token");

        $http.get(`${API_URL}/users`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => $scope.users = res.data)
        .catch(err => console.error(err));
    };

    $scope.updateActive = function(userId) {

        const token = localStorage.getItem("token");

        $http.put(`${API_URL}/users/toggle/${userId}`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => {

            $scope.logAction(
                "toggled user active",
                res.data.user.name + " -> " + res.data.user.active
            );

            $scope.getUsers();
        })
        .catch(err => console.error(err));
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

            $scope.logAction("created user", newUser.name);

            $scope.getUsers();
        })
        .catch(err => console.error(err));
    };

    $scope.createCourse = function () {

        const token = localStorage.getItem("token");

        $http.post(`${API_URL}/courses`, $scope.newCourse, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => {

            $scope.logAction("created course", $scope.newCourse.name);

            $scope.newCourse = {};
            $scope.getCourses();
        })
        .catch(err => console.error(err));
    };

    $scope.getCourses = function () {
        $http.get(`${API_URL}/courses`)
            .then(res => $scope.courses = res.data)
            .catch(err => console.error(err));
    };

    $scope.getAllAvailability = function () {

        const token = localStorage.getItem("token");

        $http.get(`${API_URL}/admin/availability`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => $scope.tutorAvailability = res.data)
        .catch(err => console.error(err));
    };

    $scope.assignTutorHours = function () {

        const token = localStorage.getItem("token");

        // FIX: force capitalized day (fixes Mongo enum crash)
        const fixedDay = $scope.selectedTutorAvailability.day
            ? $scope.selectedTutorAvailability.day.charAt(0).toUpperCase() +
              $scope.selectedTutorAvailability.day.slice(1)
            : "";

        const data = {
            tutorId: $scope.selectedTutorAvailability.tutorId,
            day: fixedDay,
            startTime: $scope.selectedTutorAvailability.startTime,
            endTime: $scope.selectedTutorAvailability.endTime
        };

        $http.post(`${API_URL}/admin/availability`, data, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => {

            $scope.logAction("assigned tutor hours", data.tutorId);

            $scope.getAllAvailability();
        })
        .catch(err => console.error(err));
    };

    $scope.deleteAvailability = function(id) {

        const token = localStorage.getItem("token");

        $http.delete(`${API_URL}/admin/availability/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(() => {

            $scope.logAction("deleted availability", id);

            $scope.getAllAvailability();
        })
        .catch(err => console.error(err));
    };

    $scope.getUsers();
    $scope.getCourses();
    $scope.getAllAvailability();
}]);

myApp.controller('loginFunctions', ['$scope', '$http', function ($scope, $http) {

    const API_URL = "http://localhost:5001/api";

    $scope.headerString = '../subviews/guestHeader.html';
    $scope.logName = '';
    $scope.userRole = 'guest';
    $scope.loginData = {};

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

    $scope.loginUser = function () {

        $http.post(`${API_URL}/auth/login`, $scope.loginData)
            .then(res => {

                localStorage.setItem("token", res.data.token);
                localStorage.setItem("userId", res.data.user.id);
                localStorage.setItem("role", res.data.user.role);
                localStorage.setItem("name", res.data.user.name);

                $scope.determineHeader();

                window.location.href = "/views/homePage.html";
            })
            .catch(err => console.error(err));
    };

    $scope.logoutUser = function() {

        localStorage.clear();

        $scope.determineHeader();

        delete $http.defaults.headers.common.Authorization;
        window.location.href = "/views/homePage.html";
    };

    $scope.determineHeader();
}]);

myApp.controller('handleEvents', ['$scope', '$http', function ($scope, $http) {

    const API_URL = "http://localhost:5001/api";

    $scope.appointment = {};
    $scope.appointments = [];
    $scope.courses = [];
    $scope.tutorAppointments = [];
    $scope.isBooking = false;

    // FIXED: slots restored
    $scope.slots = [
        { label: "9:00 - 10:00", value: "9:00-10:00" },
        { label: "10:00 - 11:00", value: "10:00-11:00" },
        { label: "11:00 - 12:00", value: "11:00-12:00" },
        { label: "1:00 - 2:00", value: "1:00-2:00" },
        { label: "2:00 - 3:00", value: "2:00-3:00" }
    ];

    const savedToken = localStorage.getItem("token");

    if (savedToken) {
        $http.defaults.headers.common.Authorization = `Bearer ${savedToken}`;
    }

    let today = new Date();
    $scope.today = today.toISOString().split("T")[0];

    let max = new Date();
    max.setDate(max.getDate() + 21);
    $scope.maxDate = max.toISOString().split("T")[0];

    $scope.getCourses = function () {
        $http.get(`${API_URL}/courses`)
            .then(res => $scope.courses = res.data)
            .catch(err => console.error(err));
    };

    $scope.setBooking = function(course) {
        $scope.appointment.tutorName = course.tutor?._id || course.tutor;
        $scope.appointment.courseName = course.name;
    };

    $scope.bookAppointment = function () {

        if ($scope.isBooking) return;

        const token = localStorage.getItem("token");

        if (!$scope.appointment.slot || !$scope.appointment.date) {
            alert("select date and time");
            return;
        }

        $scope.isBooking = true;

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
        .then(() => $scope.getMyAppointments())
        .catch(err => console.error(err))
        .finally(() => $scope.isBooking = false);
    };

    $scope.getMyAppointments = function () {

        const token = localStorage.getItem("token");

        $http.get(`${API_URL}/appointments/my`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => $scope.appointments = res.data)
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
        .then(res => $scope.tutorAppointments = res.data)
        .catch(err => console.error(err));
    };

    $scope.getCourses();
    $scope.getMyAppointments();
    $scope.getTutorAppointments();

}]);