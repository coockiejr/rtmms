angular.module('rtmms.hRtm').controller('HarmonizedRosettaController', ['$scope', 'AuthService', 'HRosettaService', 'dialogs', 'uiGridConstants', function($scope, AuthService, HRosettaService, dialogs, uiGridConstants) {

     $scope.authService = AuthService;
    $scope.$watch('authService.isLoggedIn()', function(user) {
        $scope.user = user;
    });



    var paginationOptions = {
        pageNumber: 1,
        pageSize: 25,
        sort: null,
        filters: null,
    };

    $scope.gridOptions = {
        enableFiltering: true,
        useExternalFiltering: true,
        enableColumnResizing: true,
        paginationPageSizes: [25, 50, 75, 100],
        paginationPageSize: 25,
        useExternalPagination: true,
        useExternalSorting: true,
        enableRowSelection: true,
        columnDefs: [{
            name: 'groups',
            cellFilter: 'ArrayAsString'
        }, {
            name: 'refid'
        }, {
            name: 'cfCode10'
        }, {
            name: 'systematicName'
        }, {
            name: 'commonTerm'
        }, {
            name: 'acronym'
        }, {
            name: 'termDescription'
        }, {
            name: 'units',
            field: 'units',
            cellTemplate: '<div class="ui-grid-cell-contents"><span class="bold">{{row.entity.unitGroups | UnitGroupsAsString }}</span> <span>{{row.entity.units | UnitsAsString }}</span></div>'
        }, {
            name: 'enums',
            field: 'enums',
            cellTemplate: '<div class="ui-grid-cell-contents"><span class="bold">{{row.entity.enumGroups | EnumGroupsAsString }}</span> <span>{{row.entity.enums | EnumsAsString }}</span></div>'
        }, {
            name: 'vendorDescription',
            cellFilter: 'ArrayAsString'
        }, {
            name: 'displayName',
            cellFilter: 'ArrayAsString'
        }, {
            name: 'vendorVmd',
            cellFilter: 'ArrayAsString'
        }],
        onRegisterApi: function(gridApi) {
            $scope.gridApi = gridApi;
            $scope.gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
                if (sortColumns.length === 0) {
                    paginationOptions.sort = null;
                } else {
                    paginationOptions.sort = {column:sortColumns[0].colDef.name,value:sortColumns[0].sort.direction};
                }
                getPage();
            });

            gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
                paginationOptions.pageNumber = newPage;
                paginationOptions.pageSize = pageSize;
                getPage();
            });

            gridApi.core.on.filterChanged($scope, function() {
                var grid = this.grid;
                paginationOptions.filters = [];
                angular.forEach(grid.columns, function(value, key) {
                    if (value.filters[0].term) {
                        paginationOptions.filters.push({
                            column: value.colDef.name,
                            value: value.filters[0].term
                        });
                    }
                });
                getPage();
            });

        }
    };

    var getPage = function() {
        HRosettaService.getHRosettas({
            limit: paginationOptions.pageSize,
            skip: (paginationOptions.pageNumber - 1) * paginationOptions.pageSize,
            filters: paginationOptions.filters,
            sort: paginationOptions.sort
        }).then(function(result) {
            if (result !== null) {
                $scope.gridOptions.data = result.hrosettas;
                $scope.gridOptions.totalItems = result.totalItems;
            }
        });

    };


    getPage();
   
}]);

angular.module('rtmms.hRtm').controller('HarmonizedRosettaModalInstanceController', ['$scope', '$modalInstance', 'hrosetta',  function($scope, $modalInstance, hrosetta) {


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
