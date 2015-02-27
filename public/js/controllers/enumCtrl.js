angular.module('rtmms.enum').controller('EnumsController', ['$scope', '$state', 'AuthService', function($scope, $state, AuthService) {

    $scope.authService = AuthService;
    $scope.$watch('authService.isLoggedIn()', function(user) {
        $scope.user = user;
    });

    //check local data to go to preview enum page 

    $state.go('/enums.enumGroups');
}]);
