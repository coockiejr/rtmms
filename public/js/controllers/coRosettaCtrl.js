angular.module('rtmms.authentication').controller('CoRosettaController', ['$scope', 'AuthService', 'RosettaService', 'dialogs', 'uiGridConstants', function($scope, AuthService, RosettaService, dialogs, uiGridConstants) {

    $scope.authService = AuthService;
    $scope.$watch('authService.isLoggedIn()', function(user) {
        $scope.user = user;
    });

    $scope.user = AuthService.isLoggedIn();
    $scope.vendor = function() {
        var org = JSON.parse($scope.co);
        paginationOptions.contributingOrganization = org.name;

        getPage();
    };




    var paginationOptions = {
        pageNumber: 1,
        pageSize: 25,
        sort: null,
        filters: null,
        contributingOrganization: undefined
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
            name:'info',
            cellTemplate:' <button class="glyphicon glyphicon-info-sign" ns-popover ns-popover-template="popover" ns-popover-trigger="click" ns-popover-placement="right" >  </button>',
            width:50
        },{
            name: 'groups',
            field: 'groups',
            cellTemplate: '<div class="ui-grid-cell-contents" ><span>{{row.entity.groups | ArrayAsString }}</span></div>'
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
                    if (row.entity.term.status === "mapped") {
                        return 'orange';
                    }
                }
            }
        }, {
            name: 'cfCode10',
            field: 'term.cfCode10'
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
        }, {
            name: 'partition',
            field: 'term.partition'
        }, {
            name: 'units',
            field: 'units',
            cellTemplate: '<div class="ui-grid-cell-contents"><span class="bold">{{row.entity.unitGroups | EnumOrUnitGroupsAsString }}</span> <span>{{row.entity.units | UnitsAsString }}</span></div>',
            enableSorting: false
        }, {
            name: 'ucums',
            field: 'ucums',
            cellTemplate: '<div class="ui-grid-cell-contents"><span>{{row.entity | UcumsAsStringFromRosetta }}</div>',
            enableSorting: false
        }, {
            name: 'enums',
            field: 'enums',
            cellTemplate: '<div class="ui-grid-cell-contents"><span class="bold">{{row.entity.enumGroups | EnumOrUnitGroupsAsString }}</span> <span>{{row.entity.enums | EnumsAsString }}</span></div>',
            enableSorting: false
        }, {
            name: 'code10',
            field: 'term.code10'
        }, {
            name: 'contributingOrganization',
            field: 'contributingOrganization.name'
        }, {
            name: 'vendorDescription',
            field: 'vendorDescription'
        }, {
            name: 'displayName',
            field: 'displayName'
        }, {
            name: 'vendorVmd',
            field: 'vendorVmd'
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


            gridApi.selection.on.rowSelectionChanged($scope, function(row) {
                if (row.isSelected) {
                    $scope.selectedEntity = row.entity;
                } else {
                    $scope.selectedEntity = null;
                }
            });
        }
    };
    var getPage = function() {

        RosettaService.getMyRosettas({
            limit: paginationOptions.pageSize,
            skip: (paginationOptions.pageNumber - 1) * paginationOptions.pageSize,
            filters: paginationOptions.filters,
            sort: paginationOptions.sort,
            contributingOrganization: paginationOptions.contributingOrganization
        }).then(function(result) {
            if (result !== null) {


                $scope.gridOptions.data = result.rosettas;

                $scope.gridOptions.totalItems = result.totalItems;
            }
        });

    };
    getPage();


    $scope.getCOs = function() {


        RosettaService.getCos({
            limit: paginationOptions.pageSize,
            skip: (paginationOptions.pageNumber - 1) * paginationOptions.pageSize,
            filters: paginationOptions.filters,
            sort: paginationOptions.sort,
        }).then(function(result) {
            if (result !== null) {
                $scope.cos = result.cos;

            }
        });
    };

    $scope.propose = function(rosetta) {
        if (rosetta.term.status === undefined) {
            rosetta.term.status = "proposed";
        }

        RosettaService.editRosetta(rosetta);


    };
    $scope.proposeMap = function(rosetta) {
        if (rosetta.term.status === "pMapped") {
            rosetta.term.status = "rMapped";
        } else {
            alert("Please select a term with mapped refid");
        }

        RosettaService.editRosetta(rosetta);


    };
    $scope.showAddRosettaModal = function() {
        RosettaService.showAddRosettaModal().then(function(rosetta) {
            if (rosetta !== null) {
                $scope.gridOptions.data.unshift(rosetta);
            }
        });
    };

    $scope.showEditRosettaModal = function(rosetta) {
        RosettaService.showEditRosettaModal(rosetta).then(function() {

        });
    };




}]);


angular.module('rtmms.rosetta').controller('CoController', ['$scope', '$http', 'AuthService', 'RosettaService', 'dialogs', 'uiGridConstants', function($scope, $http, AuthService, RosettaService, dialogs, uiGridConstants) {

    $scope.authService = AuthService;
    $scope.$watch('authService.isLoggedIn()', function(user) {
        $scope.user = user;
    });

    $scope.user = AuthService.isLoggedIn();
    $scope.vendor = function() {
        paginationOptions.contributingOrganization = $scope.co;
        getPage();
    };




    var paginationOptions = {
        pageNumber: 1,
        pageSize: 25,
        sort: null,
        filters: null,
        contributingOrganization: ''
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
            name: 'name',
            field: 'name',
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


            gridApi.selection.on.rowSelectionChanged($scope, function(row) {
                if (row.isSelected) {
                    $scope.selectedEntity = row.entity;
                } else {
                    $scope.selectedEntity = null;
                }
            });
        }
    };
    var getPage = function() {

        RosettaService.getCos({
            limit: paginationOptions.pageSize,
            skip: (paginationOptions.pageNumber - 1) * paginationOptions.pageSize,
            filters: paginationOptions.filters,
            sort: paginationOptions.sort,
        }).then(function(result) {
            if (result !== null) {
                $scope.gridOptions.data = result.cos;

                $scope.gridOptions.totalItems = result.totalItems;
            }
        });

    };
    getPage();


    $scope.getCOs = function() {


        RosettaService.getCos({
            limit: paginationOptions.pageSize,
            skip: (paginationOptions.pageNumber - 1) * paginationOptions.pageSize,
            filters: paginationOptions.filters,
            sort: paginationOptions.sort,
        }).then(function(result) {
            if (result !== null) {

                $scope.cos = result.cos;
            }
        });
    };
    $scope.approve = function(rosetta) {
        rosetta.term.status = "proposed";
        RosettaService.editRosetta(rosetta);


    };
    $scope.showAddCOModal = function() {
        RosettaService.showAddCOModal().then(function(co) {
            if (co !== null) {
                $scope.gridOptions.data.unshift(co);
            }
        });
    };

    $scope.showEditCOModal = function(co) {
        // console.log(co);
        RosettaService.showEditCOModal(co).then(function() {



        });
    };





}]);

angular.module('rtmms.rosetta').controller('CoModalInstanceController', ['$scope', '$modalInstance', '$http', 'co', 'AuthService', 'RosettaService', 'dialogs', 'uiGridConstants', function($scope, $modalInstance, $http, co, AuthService, RosettaService, dialogs, uiGridConstants) {

    $scope.authService = AuthService;
    $scope.$watch('authService.isLoggedIn()', function(user) {
        $scope.user = user;
    });

    $scope.user = AuthService.isLoggedIn();
    // console.log(co);
    $scope.editmode = false;
    if (co) {
        $scope.org = co;
        //$scope.Co=$scope.org.name;
        $scope.editmode = true;
    } else {
        $scope.org = {};
        //$scope.Co='';
        $scope.editmode = false;
    }




    $scope.addCo = function() {

        //$scope.formData.term.status="proposed";
        $http.post('/api/addCo/' + $scope.org.name).then(function(res) {
            $scope.message = res.data;
            alert($scope.message);
        });

        $modalInstance.dismiss('add');

    };
    $scope.editCo = function() {
        $modalInstance.close($scope.org);
        //$scope.formData.term.status="proposed";
        // $http.put('/api/cos/'+$scope.Co,"test");

        //$modalInstance.dismiss('add');

    };




}]);
