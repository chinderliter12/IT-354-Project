var myApp = angular.module('myBigApp', []);

myApp.controller('handleEvents', ['$scope', '$http', function ($scope, $http) {

    const API_URL = "http://localhost:5001/api";

    // Data models used by the view
    $scope.loginData = {};
    $scope.register = {};
    $scope.appointment = {};
    $scope.appointments = [];
    $scope.courses = [];

    //Create new user
    $scope.addUser = function () {
    const newUser = {
        name: document.getElementById("userName").value,
        username: document.getElementById("userUsername").value,
        email: document.getElementById("userEmail").value,
        password: document.getElementById("userPass").value,
        role: document.getElementById("userRole").value,
        active: true
    };

    if (!newUser.name || !newUser.username || !newUser.email || !newUser.role) {
        return alert("Invalid user information");
    }

    $http.post(`${API_URL}/users`, newUser)
        .then(res => {
            console.log("User created:", res.data);

            document.getElementById("userName").value = "";
            document.getElementById("userUsername").value = "";
            document.getElementById("userEmail").value = "";
            document.getElementById("userRole").value = "";

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
    }

    // Login user and store JWT + user info
    // ADD: tutor availability storage (NEW)
    $scope.availability = [];

    // ADD: load saved token (FIX)
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
        $http.defaults.headers.common.Authorization = `Bearer ${savedToken}`;
    }

    // DATE LIMIT 
    let today = new Date();
    $scope.today = today.toISOString().split("T")[0];

    let max = new Date();
    max.setDate(max.getDate() + 21);
    $scope.maxDate = max.toISOString().split("T")[0];


    // LOGIN USER
    $scope.loginUser = function () {

        $http.post(`${API_URL}/auth/login`, $scope.loginData)
            .then(res => {

                localStorage.setItem("token", res.data.token);
                localStorage.setItem("userId", res.data.user.id);
                localStorage.setItem("role", res.data.user.role);
                localStorage.setItem("name", res.data.user.name);

                $http.defaults.headers.common.Authorization =
                    `Bearer ${res.data.token}`;

                alert("Login successful!");

                // ✅ FIX: role-based redirect (ADDED)
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


    // REGISTER USER
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


    // GET COURSES
    $scope.getCourses = function () {

        $http.get(`${API_URL}/courses`)
            .then(res => {
                $scope.courses = res.data;
            })
            .catch(err => console.error(err));
    };


    // ADD COURSE
    $scope.addCourse = function () {

        const newCourse = {
            name: document.getElementById("courseName").value,
            tutor: document.getElementById("courseTutor").value,
            description: document.getElementById("courseDesc").value
        };

        if (!newCourse.name || !newCourse.tutor || !newCourse.description) {
            return alert("All fields required");
        }

        $http.post(`${API_URL}/courses`, newCourse)
            .then(res => {

                document.getElementById("courseName").value = "";
                document.getElementById("courseTutor").value = "";
                document.getElementById("courseDesc").value = "";

                $scope.getCourses();
            })
            .catch(err => console.error(err));
    };


    // GET APPOINTMENTS
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


    // CANCEL APPOINTMENT
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

    // BOOK APPOINTMENT
    $scope.bookAppointment = function () {

        const token = localStorage.getItem("token");

        if (!token) {
            return alert("You must be logged in");
        }

        // ADDED: session safety check
        if (!$scope.appointment.slot) {
            return alert("Please select a time slot");
        }

        let times = $scope.appointment.slot.split("-");

        if (!times || times.length !== 2) {
            return alert("Please select a valid time slot");
        }

        let data = {
            tutor: $scope.appointment.tutorId,
            date: $scope.appointment.date,
            course: $scope.appointment.course || "IT179",
            startTime: times[0],
            endTime: times[1]
        };

        $http.post(`${API_URL}/appointments`, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            alert("Appointment booked!");
            $scope.getAppointments();
        })
        .catch(err => {
            alert(err.data?.message || "Booking failed");
        });
    };


    // SLOT FILTER HELPER
    $scope.isSlotAvailable = function(slot, bookedSlots) {
        return !bookedSlots.includes(slot);
    };


    // Initial data load
    $scope.getUsers();
    $scope.getCourses();
    $scope.getAppointments();

}]);