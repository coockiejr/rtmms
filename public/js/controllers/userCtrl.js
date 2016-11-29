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

        $http.post('/api/restore/', $scope.backups.selected).then(function(res) {});
    };


    $http.get('/api/readFile').then(function(res) {

        $scope.backups = {
            selected: null,
            available: res.data.split(","),
            //  time:available.split("_"),
        };

        //$scope.backups = res.data.split(",");
    });



    $scope.showEditUserModal = function(user) {

        AuthService.showEditUserModal(user).then(function(user) {});
    };

    $scope.showAddUserModal = function(user) {

        AuthService.showAddUserModal(user).then(function(user) {});
    };
    $scope.approveUserAndCo = function(user) {
        AuthService.approveUserAndCo(user).then(function(user) {});
    };




}]);


angular.module('rtmms.authentication').controller('approveUserAndCoModalInstanceController', ['$scope', '$modalInstance', 'Restangular', 'user', 'AuthService', 'RosettaService', function($scope, $modalInstance, Restangular, user, AuthService, RosettaService) {
    $scope.isAdmin = true;
    var formUserInitial;
    $scope.editmode = false;

    $scope.getUserTypes = function() {

        AuthService.getUserTypes().then(function(userTypes) {

            $scope.usertypes = userTypes;

        });

    };
    $scope.getCOs = function() {

        orgs = [];
        RosettaService.getCos({}).then(function(result) {
            if (result !== null) {

                for (i = 0; i < result.cos.length; i++) {
                    orgs[i] = {
                        _id: result.cos[i]._id,
                        name: result.cos[i].name

                    };
                }
                $scope.cos = orgs;
            }
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

    $scope.cancel = function() {
        $scope.formUser = formUserInitial;

        $modalInstance.dismiss('cancel');
    };


}]);


angular.module('rtmms.authentication').controller('UsersModalInstanceController', ['$scope', '$modalInstance', 'Restangular', 'user', 'AuthService', 'RosettaService', function($scope, $modalInstance, Restangular, user, AuthService, RosettaService) {
    $scope.isAdmin = true;
    var formUserInitial;
    $scope.editmode = false;

    $scope.getUserTypes = function() {

        AuthService.getUserTypes().then(function(userTypes) {

            $scope.usertypes = userTypes;

        });

    };
    $scope.getCOs = function() {

        orgs = [];
        RosettaService.getCos({}).then(function(result) {
            if (result !== null) {

                for (i = 0; i < result.cos.length; i++) {
                    orgs[i] = {
                        _id: result.cos[i]._id,
                        name: result.cos[i].name

                    };
                }
                $scope.cos = orgs;
            }
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
        console.log($scope.formUser);
        AuthService.createUser($scope.formUser);
        $modalInstance.dismiss('add');



    };
    $scope.cancel = function() {
        $scope.formUser = formUserInitial;

        $modalInstance.dismiss('cancel');
    };


}]);