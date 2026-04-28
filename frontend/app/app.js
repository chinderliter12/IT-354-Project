var myApp = angular.module('myBigApp', []);

myApp.controller('handleEvents', ['$scope', '$http', function ($scope, $http) {

    const API_URL = "http://localhost:5001/api";

    // ================= DATA =================
    $scope.courses = [];

    // ================= GET COURSES =================
    $scope.getCourses = function () {
        $http.get(`${API_URL}/courses`)
            .then(res => {
                console.log("COURSES:", res.data);
                $scope.courses = res.data;
            })
            .catch(err => console.error(err));
    };

    // ================= ADD COURSE =================
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

    // ================= INIT =================
    $scope.getCourses();

}]);