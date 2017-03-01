angular.module('rtmms.unit').controller('UnitGroupController', ['$scope', 'AuthService', 'UnitService', function($scope, AuthService, UnitService) {
    var unitCtrl = this;
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
        enableColumnResizing: true,
        paginationPageSizes: [25, 50, 75, 100],
        paginationPageSize: 25,
        useExternalPagination: true,
        useExternalSorting: true,
        useExternalFiltering: true,
        enableGridMenu: true,
        enableRowSelection: true,
        multiSelect: false,
        enableSelectAll: false,
        selectionRowHeaderWidth: 35,
        columnDefs: [{
            name: 'groupName',
            field: 'groupName',
            cellTemplate: '<div class="ui-grid-cell-contents" >{{row.entity.groupName}}</div>',

        }, {
            name: 'groupDescription',
            field: 'groupDescription'
        }],

        onRegisterApi: function(gridApi) {
            $scope.gridApi = gridApi;
            $scope.gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
                if (sortColumns.length === 0) {
                    paginationOptions.sort = null;
                } else {
                    paginationOptions.sort = {
                        column: sortColumns[0].colDef.field,
                        value: sortColumns[0].sort.direction
                    };
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
                            column: value.colDef.field,
                            value: value.filters[0].term
                        });
                    }
                });
                getPage();
            });

            if (gridApi.selection !== undefined) {
                gridApi.selection.on.rowSelectionChanged($scope, function(row) {
                    if (row.isSelected) {
                        $scope.selectedEntity = row.entity;
                        $scope.gridOptionsUnits.data = row.entity.units;
                        $scope.gridOptionsUnits.totalItems = row.entity.units.length;
                    } else {
                        $scope.selectedEntity = null;
                        $scope.gridOptionsUnits.data = null;
                        $scope.gridOptionsUnits.totalItems = 0;
                    }
                });
            }

        }
    };

    var getPage = function() {
        console.log("IN GET PAGE");
        UnitService.getUnitGroups({
            limit: paginationOptions.pageSize,
            skip: (paginationOptions.pageNumber - 1) * paginationOptions.pageSize,
            filters: paginationOptions.filters,
            sort: paginationOptions.sort
        }).then(function(result) {
            console.log("GROUP");
            console.log(result);
            if (result !== null) {
                $scope.gridOptions.data = result.unitGroups;
                $scope.gridOptions.totalItems = result.totalItems;
            }
        });

    };
    getPage();




    $scope.gridOptionsUnits = {
        enableColumnResizing: true,
        paginationPageSizes: [25, 50, 75, 100],
        paginationPageSize: 25,
        useExternalPagination: true,
        useExternalSorting: true,
        useExternalFiltering: true,
        enableGridMenu: true,
        enableRowSelection: true,
        multiSelect: false,
        enableSelectAll: false,
        selectionRowHeaderWidth: 35,

        columnDefs: [{
            name: 'refid',
            field: 'term.refid',
            cellTemplate: '<div class="ui-grid-cell-contents" data-toggle="tooltip" data-placement="top" title={{row.entity.term.status}}><span>{{row.entity.term.refid}}</span></div>',
            cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {

                if (row.entity.term !== undefined) {
                    if (row.entity.term.status === undefined || row.entity.term.status === "pMapped") {

                        return 'red';
                    }
                    if (row.entity.term.status === "proposed") {
                        return 'blue';
                    }
                    if (row.entity.term.status === "registered") {
                        return 'green';
                    }
                    if (row.entity.term.status === "unregistered") {
                        return 'purple';
                    }
                    if (row.entity.term.status === "rMapped") {
                        return 'orange';
                    }
                }
            }
        }, {
            name: 'ucode10',
            field: 'term.code10'
        }, {
            name: 'cfUcode10',
            field: 'term.cfCode10'
        }, {
            name: 'partition',
            field: 'term.partition'
        }, {
            name: 'dimension',
            field: 'dimension'
        }, {
            name: 'dimC',
            field: 'dimC'
        }, {
            name: 'symbol',
            field: 'symbol'
        }, {
            name: 'unitOfMeasure',
            field: 'unitOfMeasure'
        }, {
            name: 'ucums',
            field: 'ucums',
            cellTemplate: '<div class="ui-grid-cell-contents"> <span>{{row.entity.ucums | UcumsAsString }} </span></div>',
            enableSorting: false
        }, {
            name: 'systematicName',
            field: 'term.systematicName'
        }, {
            name: 'commonTerm',
            field: 'term.commonTerm'
        }, {
            name: 'acronym',
            field: 'term.acronym'
        }, {
            name: 'termDescription',
            field: 'term.termDescription'
        }],
        onRegisterApi: function(gridApi) {
            $scope.gridApi = gridApi;
        }
    };
    $scope.showAddUnitGroupModal = function() {
        UnitService.showAddUnitGroupModal().then(function(unitValue) {
            if (unitValue !== null) {
                $scope.gridOptions.data.unshift(unitValue);
                getPage();
            }
        });
    };

    $scope.showEditUnitGroupModal = function(group) {
        UnitService.showEditUnitGroupModal(group).then(function() {
            getPage();
        });
    };

}]);



angular.module('rtmms.unit').controller('UnitGroupModalInstanceController', ['$scope', '$modalInstance', 'Restangular', 'group', 'UnitService', 'RosettaService', function($scope, $modalInstance, Restangular, group, UnitService, RosettaService) {

    var initialGroup = angular.copy(group);
    
    $scope.removeUnit = function(unit) {
        console.log(unit);
        for (var i = 0; i < $scope.gridOptionsGUnits.data.length; i++) {
            if ($scope.gridOptionsGUnits.data[i]._id === unit._id) {
                $scope.gridOptionsGUnits.data.splice(i, 1);
            }
        }
        getPage();
    };
    $scope.addUnit = function(unit) {
        $scope.gridOptionsGUnits.data.push(unit);
        getPage();
    };
    $scope.gridOptionsGUnits = {
        enableColumnResizing: true,
        paginationPageSizes: [25, 50, 75, 100],
        paginationPageSize: 25,
        useExternalPagination: true,
        useExternalSorting: true,
        useExternalFiltering: true,
        enableGridMenu: true,
        enableRowSelection: true,
        multiSelect: false,
        enableSelectAll: false,
        selectionRowHeaderWidth: 35,

        columnDefs: [{
            name: 'action',
            cellTemplate: ' <i class="fa fa-remove" style="margin-left:10px;margin-right:10px"  ng-click="grid.appScope.removeUnit(row.entity)" >  </i>',
            width: 50,
            enableFiltering: false,
        }, {
            name: 'refid',
            field: 'term.refid',
            minWidth: 200,
            width: 250,
            cellTemplate: '<div  class="ui-grid-cell-contents" data-toggle="tooltip" data-placement="top" title={{row.entity.term.status}}><span>{{row.entity.term.refid}}</span></div>',
            cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
                console.log(colRenderIndex);
                console.log(row);
                if (row.entity.term !== undefined) {
                    if (row.entity.term.status === undefined || row.entity.term.status === "pMapped") {

                        return 'red';
                    }
                    if (row.entity.term.status === "proposed") {
                        return 'blue';
                    }
                    if (row.entity.term.status === "registered") {
                        return 'green';
                    }
                    if (row.entity.term.status === "unregistered") {
                        return 'purple';
                    }
                    if (row.entity.term.status === "rMapped") {
                        return 'orange';
                    }
                }
            }
        }],
        onRegisterApi: function(gridApi) {
            $scope.gridApi = gridApi;

        }
    };


    var paginationOptions = {
        pageNumber: 1,
        pageSize: 25,
        sort: null,
        filters: null,
    };
    $scope.gridOptionsRUnits = {
        enableColumnResizing: true,
        enableFiltering: true,
        paginationPageSizes: [25, 50, 75, 100],
        paginationPageSize: 25,
        useExternalPagination: true,
        useExternalSorting: true,
        useExternalFiltering: true,
        enableGridMenu: true,
        enableRowSelection: true,
        multiSelect: false,
        enableSelectAll: false,
        selectionRowHeaderWidth: 35,
        columnDefs: [{
            name: 'action',
            cellTemplate: ' <i class="fa fa-plus" style="margin-left:10px;margin-right:10px"  ng-click="grid.appScope.addUnit(row.entity)" >  </i>',
            width: 50,
            enableFiltering: false,
        }, {
            name: 'refid',
            minWidth: 150,
            width: 200,
            field: 'term.refid',
            cellTemplate: '<div class="ui-grid-cell-contents" data-toggle="tooltip" data-placement="top" title={{row.entity.term.status}}><span>{{row.entity.term.refid}}</span></div>',
            cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {

                if (row.entity.term !== undefined) {
                    if (row.entity.term.status === undefined || row.entity.term.status === "pMapped") {

                        return 'red';
                    }
                    if (row.entity.term.status === "proposed") {
                        return 'blue';
                    }
                    if (row.entity.term.status === "registered") {
                        return 'green';
                    }
                    if (row.entity.term.status === "unregistered") {
                        return 'purple';
                    }
                    if (row.entity.term.status === "rMapped") {
                        return 'orange';
                    }
                }
            }
        }, {
            name: 'ucode10',
            field: 'term.code10',
            width: 100,

        }, {
            name: 'cfUcode10',
            field: 'term.cfCode10',
            width: 100
        }, {
            name: 'partition',
            field: 'term.partition',
            width: 100
        }, {
            name: 'dimension',
            field: 'dimension',
            width: 100
        }, {
            name: 'dimC',
            field: 'dimC',
            width: 100
        }, {
            name: 'symbol',
            field: 'symbol',
            width: 100
        }, {
            name: 'unitOfMeasure',
            field: 'unitOfMeasure',
            width: 100
        }, {
            name: 'ucums',
            field: 'ucums',
            cellTemplate: '<div class="ui-grid-cell-contents"> <span>{{row.entity.ucums | UcumsAsString }} </span></div>',
            enableSorting: false,
            width: 100
        }, {
            name: 'systematicName',
            field: 'term.systematicName',
            width: 100
        }, {
            name: 'commonTerm',
            field: 'term.commonTerm',
            width: 100
        }, {
            name: 'acronym',
            field: 'term.acronym',
            width: 100
        }, {
            name: 'termDescription',
            field: 'term.termDescription',
            width: 100,
        }],
        onRegisterApi: function(gridApi) {
            $scope.gridApiRU = gridApi;
            $scope.gridApiRU.core.on.sortChanged($scope, function(grid, sortColumns) {
                if (sortColumns.length === 0) {
                    paginationOptions.sort = null;
                } else {
                    paginationOptions.sort = {
                        column: sortColumns[0].colDef.field,
                        value: sortColumns[0].sort.direction
                    };
                }
                getPage();
            });

            $scope.gridApiRU.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
                paginationOptions.pageNumber = newPage;
                paginationOptions.pageSize = pageSize;
                getPage();
            });

            $scope.gridApiRU.core.on.filterChanged($scope, function() {
                var grid = this.grid;
                paginationOptions.filters = [];
                angular.forEach(grid.columns, function(value, key) {
                    if (value.filters[0].term) {
                        paginationOptions.filters.push({
                            column: value.colDef.field,
                            value: value.filters[0].term
                        });
                    }
                });
                getPage();
            });


            if ($scope.gridApiRU.selection !== undefined) {
                $scope.gridApiRU.selection.on.rowSelectionChanged($scope, function(row) {
                    if (row.isSelected) {
                        $scope.selectedEntity = row.entity;
                    } else {
                        $scope.selectedEntity = null;
                    }
                });
            }


        }
    };
    var getPage = function() {
        UnitService.getUnits({
            limit: paginationOptions.pageSize,
            skip: (paginationOptions.pageNumber - 1) * paginationOptions.pageSize,
            filters: paginationOptions.filters,
            sort: paginationOptions.sort
        }).then(function(result) {
            if (result !== null) {
                for (var i = 0; i < result.units.length; i++) {
                    for (var j = 0; j < $scope.gridOptionsGUnits.data.length; j++) {
                        if (result.units[i]._id === $scope.gridOptionsGUnits.data[j]._id) {
                            result.units.splice(i, 1);
                            result.totalItems--;

                        }
                    }
                }
                $scope.gridOptionsRUnits.data = result.units;
                $scope.gridOptionsRUnits.totalItems = result.totalItems;
            }
        });

    };
    getPage();
    if (group) {
        console.log(group);
        $scope.editmode = true;
        $scope.group = angular.copy(group);
        $scope.gridOptionsGUnits.data = $scope.group.units;


    } else {
        console.log("new group");
        $scope.editmode = false;
        $scope.group = {
            units : [],
            groupName : "",
            groupDescription : ""
        };
        
        $scope.gridOptionsGUnits.data = $scope.group.units;
    }








    $scope.addUnitGroup = function() {
        UnitService.createUnitGroup($scope.group);
        $modalInstance.dismiss('add');
    };

    $scope.editUnitGroup = function() {
        $modalInstance.close($scope.group);
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
}]);