angular.module('rtmms.authentication').controller('SignUpController', ['$scope', '$http', '$state', 'RosettaService', 'AuthService', function($scope, $http, $state, RosettaService, AuthService) {
    // $scope.newCo = true;
    // $scope.newCo = function() {
    //     $scope.newCo = !$scope.newCo;
    //     console.log($scope.newCo);
    // };
    // $scope.setCo = function(co) {
    //     console.log(co);
    //     $scope.user.contributingOrganization = {
    //         id: JSON.parse(co)._id,
    //         name: JSON.parse(co).name
    //     };


    // };
    $scope.signup = function(user) {

        console.log(user);

        if ($scope.userForm.$invalid) {
            return;
        }
        if ($scope.addContO) {
            $scope.user.contributingOrganization.name = $scope.newCo;
            $scope.user.contributingOrganization.status = "warning";
        } else {
            $scope.user.contributingOrganization.status = "success";

        }

        $http.post('/api/addCo', $scope.user.contributingOrganization).then(function(res) {

            $http.post("/api/signup", user).success(function(data, status) {
                // window.location.href = '/';
                $state.go('/logout');
            }).error(function(data) {
                $scope.message = data[0];
                $state.go('/signup');
            });
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
            $scope.cos.push({ name: "Add new CO" });
        });
    };
    $scope.addContO = false;
    $scope.addCo = function() {
        //  console.log($scope.user.contributingOrganization);
        $scope.addContO = true;
        // $http.post('/api/addCo/' + $scope.Co).then(function(res) {

        //     $scope.message = res.data;
        //     $scope.getCOs();
        //     $scope.Co = "";
        // });

    };
    $scope.addNewCo = function() {
        $scope.user.contributingOrganization.name = $scope.newCo;
        $scope.user.contributingOrganization.status = "warning";
        $http.post('/api/addCo/' + $scope.user.contributingOrganization).then(function(res) {

            // $scope.message = res.data;
            // $scope.getCOs();
            // $scope.Co = "";
        });
    };
    $scope.setCo = function(value) {
        console.log(value);
        if (value.name === "Add new CO") {
            $scope.addContO = true;

        } else {
            $scope.addContO = false;
        }

    };





}]);