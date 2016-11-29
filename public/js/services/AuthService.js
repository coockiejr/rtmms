angular.module('rtmms').factory('AuthService', ['Restangular', '$modal', function(Restangular, $modal) {

    var factory = {};
    var User = Restangular.all('users');
    var user;


    factory.setUser = function(aUser) {
        user = aUser;
    };
    factory.editUser = function(user) {
        user.put();
    };
    factory.createUser = function(user) {
        return User.post(user).then(
            function(user) {},
            function(res) {
                console.log('Error: ' + res.status);
            });
    };

    factory.isLoggedIn = function() {
        return (user) ? user : false;
    };


    factory.isCOLoggedIn = function() {
        if (user !== undefined && (user.userTypes.id === 1 || user.userTypes.id === 3)) {
            return (user) ? user : false;
        }

    };
    factory.isRevLoggedIn = function() {
        if (user !== undefined && (user.userTypes.id === 2)) {
            return (user) ? user : false;
        }

    };
    factory.logout = function() {
        $http.get("/logout").success(function(data, status) {
            console.log("heeeeeere");
        }).error(function(data) {
            console.log(" not heeeeeere");

        });
    };

    factory.getUserTypes = function(params) {
        return Restangular.all('usertypes').getList(params).then(
            function(userTypes) {
                return userTypes;
            },
            function(res) {
                console.log('Error: ' + res.status);
            });
    };
    factory.getUser = function(id) {
        console.log(id);
        return Restangular.one('users', id).get().then(
            function(user) {
                console.log(user);
                return user;
            },
            function(res) {
                console.log('Error: ' + res.status);
            });
    };

    factory.getUsers = function(params) {
        return Restangular.all('users').getList(params).then(
            function(users) {
                return users;
            },
            function(res) {
                console.log('Error: ' + res.status);
            });
    };

    factory.getCOs = function(params) {
        return Restangular.all('cos').getList(params).then(
            function(cos) {
                return cos;
            },
            function(res) {
                console.log('Error: ' + res.status);
            });
    };

    factory.removeUser = function(user) {
        return user.remove().then(
            function() {},
            function(res) {
                console.log('Error: ' + res.status);
            });
    };


    //Modals

    factory.showEditUserModal = function(user) {
        if (User) {
            var modalInstance = $modal.open({
                templateUrl: 'views/templates/modals/userModal.tpl.html',
                controller: 'UsersModalInstanceController',
                size: 'lg',
                resolve: {
                    user: function() {
                        return user;
                    }
                }
            });

            return modalInstance.result.then(function(user) {
                factory.editUser(user);
            }, function() {
                return null;
            });
        }
    };
    factory.showProfileModal = function(user) {
        if (User) {
            var modalInstance = $modal.open({
                templateUrl: 'views/templates/modals/profileModal.tpl.html',
                controller: 'ProfileModalInstanceController',
                size: 'lg',
                resolve: {
                    user: function() {
                        return user;
                    }
                }
            });

            return modalInstance.result.then(function(user) {
                // console.log(user.password);
                factory.editUser(user);
            }, function() {
                return null;
            });
        }
    };
    factory.showPassModal = function(user) {
        if (User) {
            var modalInstance = $modal.open({
                templateUrl: 'views/templates/modals/passModal.tpl.html',
                controller: 'PassModalInstanceController',
                size: 'lg',
                resolve: {
                    user: function() {
                        return user;
                    }
                }
            });

            return modalInstance.result.then(function(user) {
                console.log(user.password);
                factory.editUser(user);
            }, function() {
                return null;
            });
        }
    };

    factory.showAddUserModal = function() {
        var modalInstance = $modal.open({
            templateUrl: 'views/templates/modals/userModal.tpl.html',
            controller: 'UsersModalInstanceController',
            size: 'lg',
            resolve: {
                user: false
            }
        });

        return modalInstance.result.then(function(user) {
            factory.createUser(user);
            console.log("here");
            return user;
        }, function() {
            return null;
        });
    };
    factory.approveUserAndCo = function() {
        var modalInstance = $modal.open({
            templateUrl: 'views/templates/modals/approveUserAndCoModal.tpl.html',
            controller: 'approveUserAndCoModalInstanceController',
            size: 'lg',
            resolve: {
                user: false
            }
        });

        return modalInstance.result.then(function(user) {
            // factory.createUser(user);
            // console.log("here");
            return user;
        }, function() {
            return null;
        });
    };
    return factory;

}]);