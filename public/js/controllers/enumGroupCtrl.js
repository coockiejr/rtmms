angular.module('rtmms.enum').controller('EnumGroupController', ['$scope', 'AuthService', 'EnumService', function($scope, AuthService, EnumService) {
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
            field: 'groupName'
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
                        $scope.gridOptionsEnums.data = row.entity.enums;
                        $scope.gridOptionsEnums.totalItems = row.entity.enums.length;
                    } else {
                        $scope.selectedEntity = null;
                        $scope.gridOptionsEnums.data = null;
                        $scope.gridOptionsEnums.totalItems = 0;
                    }
                });
            }


        }
    };

    var getPage = function() {
        EnumService.getEnumGroups({
            limit: paginationOptions.pageSize,
            skip: (paginationOptions.pageNumber - 1) * paginationOptions.pageSize,
            filters: paginationOptions.filters,
            sort: paginationOptions.sort
        }).then(function(result) {
            if (result !== null) {
                $scope.gridOptions.data = result.enumGroups;
                $scope.gridOptions.totalItems = result.totalItems;
            }
        });

    };
    getPage();


    $scope.gridOptionsEnums = {
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
            name: 'groups',
            field: 'enums',
            cellTemplate: '<div class="ui-grid-cell-contents"   ><span>{{row.entity.enumGroups | EnumOrUnitGroupsAsString  }}</span></div>'
        }, {
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
            name: 'ecode10',
            field: 'term.code10'
        }, {
            name: 'cfEcode10',
            field: 'term.cfCode10'
        }, {
            name: 'partition',
            field: 'term.partition'
        }, {
            name: 'description',
            field: 'description'
        }, {
            name: 'token',
            field: 'token'
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
    $scope.showAddEnumGroupModal = function() {
        EnumService.showAddEnumGroupModal().then(function(enumValue) {
            if (enumValue !== null) {
                $scope.gridOptions.data.unshift(enumValue);
                getPage();
            }
        });
    };

    $scope.showEditEnumGroupModal = function(group) {
        EnumService.showEditEnumGroupModal(group).then(function() {
            getPage();
        });
    };

}]);




angular.module('rtmms.enum').controller('EnumGroupModalInstanceController', ['$scope', '$modalInstance', 'Restangular', 'group', 'EnumService', 'RosettaService', function($scope, $modalInstance, Restangular, group, EnumService, RosettaService) {

    var initialGroup = angular.copy(group);
    
    $scope.removeEnum = function(enumVal) {
        for (var i = 0; i < $scope.gridOptionsGEnums.data.length; i++) {
            if ($scope.gridOptionsGEnums.data[i]._id === enumVal._id) {
                $scope.gridOptionsGEnums.data.splice(i, 1);
            }
        }
        getPage();
    };
    $scope.addEnum = function(enumVal) {
        $scope.gridOptionsGEnums.data.push(enumVal);
        getPage();
    };
    $scope.gridOptionsGEnums = {
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
            cellTemplate: ' <i class="fa fa-remove" style="margin-left:10px;margin-right:10px"  ng-click="grid.appScope.removeEnum(row.entity)" >  </i>',
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
    $scope.gridOptionsREnums = {
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
            cellTemplate: ' <i class="fa fa-plus" style="margin-left:10px;margin-right:10px"  ng-click="grid.appScope.addEnum(row.entity)" >  </i>',
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
            name: 'ecode10',
            field: 'term.code10'
        }, {
            name: 'cfEcode10',
            field: 'term.cfCode10'
        }, {
            name: 'partition',
            field: 'term.partition'
        }, {
            name: 'description',
            field: 'description'
        }, {
            name: 'token',
            field: 'token'
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
        EnumService.getEnums({
            limit: paginationOptions.pageSize,
            skip: (paginationOptions.pageNumber - 1) * paginationOptions.pageSize,
            filters: paginationOptions.filters,
            sort: paginationOptions.sort
        }).then(function(result) {
            if (result !== null) {
                for (var i = 0; i < result.enums.length; i++) {
                    for (var j = 0; j < $scope.gridOptionsGEnums.data.length; j++) {
                        if (result.enums[i]._id === $scope.gridOptionsGEnums.data[j]._id) {
                            result.enums.splice(i, 1);
                            result.totalItems--;

                        }
                    }
                }
                $scope.gridOptionsREnums.data = result.enums;
                $scope.gridOptionsREnums.totalItems = result.totalItems;
            }
        });

    };
    getPage();
    if (group) {
        console.log(group);
        $scope.editmode = true;
        $scope.group = angular.copy(group);
        $scope.gridOptionsGEnums.data = $scope.group.enums;


    } else {
        $scope.editmode = false;
        $scope.group = {
            enums : [],
            groupName : "",
            groupDescription : ""
        };
        
        $scope.gridOptionsGEnums.data = $scope.group.enums;
    }








    $scope.addEnumGroup = function() {
        EnumService.createEnumGroup($scope.group);
        $modalInstance.dismiss('add');
    };

    $scope.editEnumGroup = function() {
        $modalInstance.close($scope.group);
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
}]);