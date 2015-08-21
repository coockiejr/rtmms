angular.module('rtmms.authentication').controller('ProfileController', ['$scope', '$http', '$state', 'AuthService', function($scope, $http, $state, AuthService) {
    $scope.isAdmin = false;
    $http({
        url: '/api/profile',
        method: 'GET',
    }).success(function(data) {
        $scope.message = data.message;
        $scope.user = data.user;
    });
    $scope.getUsers = function() {

        AuthService.getUsers().then(function(users) {
            for (i = 0; i < users.length; i++) {
                if ($scope.user.username === users[i].username)
                    $scope.user = users[i];
            }

        });

    };
    $scope.showProfileModal = function(user) {

        AuthService.showProfileModal(user).then(function(user) {});
    };
    $scope.showPassModal = function(user) {

        AuthService.showPassModal(user).then(function(user) {});
    };

}]);

angular.module('rtmms.authentication').controller('ProfileModalInstanceController', ['$scope', '$modalInstance', 'Restangular', 'user', 'AuthService', function($scope, $modalInstance, Restangular, user, AuthService) {

    var formUserInitial;
    $scope.pass = false;
    $scope.editmode = false;


    if (user) {

        $scope.formUser = user;

        formUserInitial = Restangular.copy(user);
        $scope.editmode = true;
    } else {
        $scope.formUser = {};
        $scope.editmode = false;
    }



    $scope.editUser = function() {
        $modalInstance.close($scope.formUser);
    };

    $scope.cancel = function() {
        $scope.formUser = formUserInitial;

        $modalInstance.dismiss('cancel');
    };


}]);


angular.module('rtmms.authentication').controller('PassModalInstanceController', ['$scope', '$modalInstance', 'Restangular', 'user', 'AuthService', function($scope, $modalInstance, Restangular, user, AuthService) {

    var formUserInitial;
    $scope.editmode = false;


    if (user) {

        $scope.formUser = user;
        $scope.formUser.password = '';
        formUserInitial = Restangular.copy(user);
        $scope.editmode = true;
    } else {
        $scope.formUser = {};
        $scope.editmode = false;
    }



    $scope.editUser = function() {
        $modalInstance.close($scope.formUser);
    };

    $scope.cancel = function() {
        $scope.formUser = formUserInitial;

        $modalInstance.dismiss('cancel');
    };


}]);
