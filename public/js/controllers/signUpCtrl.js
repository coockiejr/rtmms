angular.module('rtmms.authentication').controller('SignUpController', ['$scope', '$http', '$state', 'AuthService', function($scope, $http, $state, AuthService) {
    $scope.newCo = true;
    $scope.newCo = function() {
        $scope.newCo = !$scope.newCo;
        console.log($scope.newCo);
    };
    $scope.signup = function(user) {
        if ($scope.userForm.$invalid) {
            return;
        }

        $http.post("/api/signup", user).success(function(data, status) {
            window.location.href = '/';
        }).error(function(data) {
            $scope.message = data[0];
            $state.go('/signup');
        });
    };
    $scope.getUserTypes = function() {

        AuthService.getUserTypes().then(function(userTypes) {
            $scope.usertypes = userTypes;

            //return userTypes;
        });

    };

    $scope.getCOs = function() {
        AuthService.getCOs().then(function(cos) {
            $scope.cos = cos;
        });
    };





}]);
