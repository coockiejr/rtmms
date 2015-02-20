angular.module('rtmms.rosetta').controller('RosettaController', ['$scope', 'AuthService', 'RosettaService', 'dialogs', 'uiGridConstants', function($scope, AuthService, RosettaService, dialogs, uiGridConstants) {

    $scope.authService = AuthService;
    $scope.$watch('authService.isLoggedIn()', function(user) {
        $scope.user = user;
    });

    $scope.gridOptions2 = {
        enableFiltering: true,
        enableColumnResizing: true,
        columnDefs: [{
            name: 'groups',
            cellFilter: 'ArrayAsString',
            filter: {
                condition: uiGridConstants.filter.CONTAINS
            }
        }, {
            name: 'refid',
            filter: {
                condition: uiGridConstants.filter.CONTAINS
            }
        }, {
            name: 'code10',
            filter: {
                condition: uiGridConstants.filter.CONTAINS
            }
        }, {
            name: 'cfCode10',
            filter: {
                condition: uiGridConstants.filter.CONTAINS
            }
        }, {
            name: 'systematicName',
            filter: {
                condition: uiGridConstants.filter.CONTAINS
            }
        }, {
            name: 'commonTerm',
            filter: {
                condition: uiGridConstants.filter.CONTAINS
            }
        }, {
            name: 'acronym',
            filter: {
                condition: uiGridConstants.filter.CONTAINS
            }
        }, {
            name: 'termDescription',
            filter: {
                condition: uiGridConstants.filter.CONTAINS
            }
        }]
    };

    $scope.gridOptions2.onRegisterApi = function(gridApi) {
        $scope.gridApi2 = gridApi;
    };

    RosettaService.getRosettas({}).then(function(rosettas) {
        if (rosettas !== null) {
            $scope.gridOptions2.data = rosettas;
        }
    });




}]);

angular.module('rtmms.rosetta').controller('RosettaModalInstanceController', ['$scope', '$modaslInstance', 'rosetta', 'MembersService', 'RosettaService', function($scope, $modalInstance, rosetta, RosettaService) {


    $scope.editmode = false;
    if (result) {

    } else {


    }


    $scope.addResult = function() {
        if ($scope.time.hours === undefined) $scope.time.hours = 0;
        if ($scope.time.minutes === undefined) $scope.time.minutes = 0;
        if ($scope.time.seconds === undefined) $scope.time.seconds = 0;
        $scope.formData.time = $scope.time.hours * 3600 + $scope.time.minutes * 60 + $scope.time.seconds;

        var members = $.map($scope.formData.member, function(value, index) {
            return [value];
        });
        $scope.formData.member = members;


        $modalInstance.close($scope.formData);
    };

    $scope.editResult = function() {
        $modalInstance.close($scope.formData);
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };






}]);
