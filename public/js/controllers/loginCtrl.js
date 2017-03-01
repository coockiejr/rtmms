angular.module('rtmms.authentication').controller('LoginController', ['$scope', '$http', '$state', 'AuthService', function($scope, $http, $state, AuthService) {

    $http({
        url: '/api/login',
        method: 'GET',
    }).then(function(data) {
        $scope.message = data.message;
    });

    $scope.login = function(user) {
        $http.post("/api/login", user).then(function(response, status) {
           console.log("-----");
            console.log(response);
            AuthService.setUser(response.data.user);
            window.location.href = '/';
        }, function(data) {
             
            $scope.message = data.data[0];
            $state.go('/login');
        });
    };



    // action="/api/login" method="post"

}]);


angular.module('rtmms.authentication').controller('ForgotController', ['$scope', '$http', '$state', 'AuthService', function($scope, $http, $state, AuthService) {

    $http({
        url: '/api/forgot',
        method: 'GET',
    }).then(function(data) {
        $scope.message = data.message;
    });

    $scope.forgot = function() {
        console.log($scope.email);
        $http.post("/api/forgot", $scope.email).then(function(data, status) {
            console.log("Sent ok");
            //            window.location.href = '/';


        }, function(data) {
            console.log("Error");
        });
    };

    // action="/api/login" method="post"
}]);