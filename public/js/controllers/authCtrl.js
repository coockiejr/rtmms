angular.module('rtmms.authentication').controller('AuthCtrl',['$scope','$state','auth','AuthService', function($scope, $state, auth, AuthService) {

    $scope.user = {};

  $scope.register = function(){
    auth.register($scope.user).error(function(error){
      $scope.error = error;
    }).then(function(){
      $state.go('/signup');
    });
  };

  $scope.logIn = function(){
    auth.logIn($scope.user).error(function(error){
      $scope.error = error;
    }).then(function(){
      $state.go('/login');
    });
  };



    // action="/api/login" method="post"

}]);
