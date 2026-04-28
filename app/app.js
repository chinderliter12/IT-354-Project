var myApp = angular.module('myBigApp', []);

myApp.controller('handleEvents', ['$scope', '$http', function ($scope, $http) {

    const API_URL = "http://localhost:5001/api";

    // ================= INIT =================
    $scope.loginData = {};
    $scope.register = {};
    $scope.booking = {};

    // ================= DEBUG =================
    $scope.test = function () {
        console.log("Angular is working");
        alert("Angular is connected!");
    };

    // ================= LOGIN =================
    $scope.loginUser = function () {

        console.log("LOGIN SENDING:", $scope.loginData);

        const { email, password } = $scope.loginData;

        if (!email || !password) {
            return alert("Please enter email and password");
        }

        $http.post(`${API_URL}/auth/login`, { email, password })
            .then(res => {

                const token = res.data.token;

                if (!token) {
                    return alert("Login failed: no token returned");
                }

                localStorage.setItem('token', token);

                console.log("Login success:", token);
                alert("Logged in successfully!");

                $scope.getBookings();

            })
            .catch(err => {
                console.error(err);
                alert(err.data?.message || "Login failed");
            });
    };

    // ================= REGISTER =================
    $scope.registerUser = function () {

        console.log("REGISTER SENDING:", $scope.register);

        const { name, username, email, password } = $scope.register;

        if (!name || !username || !email || !password) {
            return alert("All fields required");
        }

        $http.post(`${API_URL}/auth/register`,
            $scope.register,
            {
                headers: { "Content-Type": "application/json" }
            }
        )
            .then(res => {
                console.log("REGISTER SUCCESS:", res.data);
                alert("Registration successful! Now login.");
                $scope.register = {};
            })
            .catch(err => {
                console.error(err);
                alert("ERROR: " + (err.data?.message || JSON.stringify(err.data)));
            });
    };

    // ================= COURSES =================
    $scope.getCourses = function () {
        $http.get(`${API_URL}/courses`)
            .then(res => {
                $scope.courses = res.data;
            })
            .catch(err => console.error("Courses error:", err));
    };

    // ================= CREATE BOOKING =================
    $scope.createBooking = function () {

        const token = localStorage.getItem('token');

        if (!token) {
            return alert("You must be logged in");
        }

        console.log("BOOKING SENDING:", $scope.booking);

        $http.post(`${API_URL}/bookings`, $scope.booking, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                console.log("BOOKING CREATED:", res.data);
                alert("Booking created!");
                $scope.getBookings();
            })
            .catch(err => {
                console.error(err);
                alert(err.data?.error || "Booking failed");
            });
    };

    // ================= GET BOOKINGS =================
    $scope.getBookings = function () {

        const token = localStorage.getItem('token');
        if (!token) return;

        $http.get(`${API_URL}/bookings/student`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                console.log("BOOKINGS:", res.data);
                $scope.bookings = res.data;
            })
            .catch(err => console.error("Bookings error:", err));
    };

    // ================= LOAD DATA =================
    $scope.getCourses();
    $scope.getBookings();

}]);