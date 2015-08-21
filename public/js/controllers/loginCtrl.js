angular.module('rtmms.authentication').controller('LoginController', ['$scope', '$http', '$state', 'AuthService', function($scope, $http, $state, AuthService) {

    $http({
        url: '/api/login',
        method: 'GET',
    }).success(function(data) {
        $scope.message = data.message;
    });

    $scope.login = function(user) {
        $http.post("/api/login", user).success(function(data, status) {

            AuthService.setUser(data.user);


            window.location.href = '/';
        }).error(function(data) {
            $scope.message = data[0];
            $state.go('/login');
        });
    };



    // action="/api/login" method="post"

}]);


angular.module('rtmms.authentication').controller('ForgotController', ['$scope', '$http', '$state', 'AuthService', function($scope, $http, $state, AuthService) {

    $http({
        url: '/api/forgot',
        method: 'GET',
    }).success(function(data) {
        $scope.message = data.message;
    });

    $scope.forgot = function() {
        console.log($scope.email);
        $http.post("/api/forgot",$scope.email).success(function(data, status) {
            console.log("Sent ok");
            //            window.location.href = '/';


        }).error(function(data) {
            console.log("Error");
        });
    };

    // action="/api/login" method="post"
}]);
