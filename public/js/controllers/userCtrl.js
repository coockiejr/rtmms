angular.module('rtmms.authentication').controller('UsersController', ['$scope', '$http', '$location', '$state', 'AuthService', function($scope, $http, $location, $state, AuthService) {




    $scope.getUsers = function() {

        AuthService.getUsers().then(function(users) {

            $scope.users = users;

        });

    };
    $scope.removeUser = function(index, user) {
        AuthService.removeUser(user);
        $scope.users.splice(index, 1);
    };

    $scope.approveUser = function(user) {
        user.userStat = "success";
        AuthService.editUser(user);

    };
    $scope.refuseUser = function(user) {
        user.userStat = "danger";
        AuthService.editUser(user);

    };
    $scope.backupNow = function() {

        $http.post('/api/backup/now').then(function(res) {});
    };
    $scope.backupWeek = function() {

        $http.post('/api/backup/week').then(function(res) {});
    };
    $scope.restore = function() {

        $http.post('/api/restore/',$scope.backups.selected).then(function(res) {});
    };


    $http.get('/api/readFile').then(function(res) {

        $scope.backups = {
            selected: null,
            available: res.data.split(","),
        };
        //console.log($scope.backups.available);
        //$scope.backups = res.data.split(",");
    });

   

    $scope.showEditUserModal = function(user) {

        AuthService.showEditUserModal(user).then(function(user) {});
    };

    $scope.showAddUserModal = function(user) {

        AuthService.showAddUserModal(user).then(function(user) {});
    };




}]);


angular.module('rtmms.authentication').controller('UsersModalInstanceController', ['$scope', '$modalInstance', 'Restangular', 'user', 'AuthService', function($scope, $modalInstance, Restangular, user, AuthService) {
    $scope.isAdmin = true;
    var formUserInitial;
    $scope.editmode = false;

    $scope.getUserTypes = function() {

        AuthService.getUserTypes().then(function(userTypes) {

            $scope.usertypes = userTypes;

        });

    };
    $scope.getCOs = function() {
        AuthService.getCOs().then(function(cos) {
            $scope.cos = cos;
        });
    };

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
    $scope.addUser = function() {

        AuthService.createUser($scope.formUser);
        $modalInstance.dismiss('add');



    };
    $scope.cancel = function() {
        $scope.formUser = formUserInitial;

        $modalInstance.dismiss('cancel');
    };


}]);
