angular.module('rtmms.authentication').controller('SignUpController', ['$scope', '$http', '$state', 'RosettaService', 'AuthService', function($scope, $http, $state, RosettaService, AuthService) {
    $scope.newCo = true;
    $scope.newCo = function() {
        $scope.newCo = !$scope.newCo;
        console.log($scope.newCo);
    };
    $scope.setCo = function(co) {
        console.log(co);
        $scope.user.contributingOrganization = {
            id: JSON.parse(co)._id,
            name: JSON.parse(co).name
        };
        console.log("$scope.user");

        console.log($scope.user);

    };
    $scope.signup = function(user) {
        user.test = {
            name: "TEST",
        };
        console.log(user);

        if ($scope.userForm.$invalid) {
            return;
        }

        $http.post("/api/signup", user).success(function(data, status) {
            //window.location.href = '/';
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
    $scope.addCo = function() {
        //  console.log($scope.user.contributingOrganization);
        $http.post('/api/addCo/' + $scope.Co).then(function(res) {

            $scope.message = res.data;
            $scope.getCOs();
            $scope.Co = "";
        });
    };





}]);