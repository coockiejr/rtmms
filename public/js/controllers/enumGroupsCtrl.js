angular.module('rtmms.enum').controller('EnumGroupsController', ['$scope', 'AuthService', 'dialogs', function($scope, AuthService, dialogs) {

    $scope.authService = AuthService;
    $scope.$watch('authService.isLoggedIn()', function(user) {
        $scope.user = user;
    });
    
}]);

