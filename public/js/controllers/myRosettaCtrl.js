angular.module('rtmms.rosetta').controller('MyRosettaController', ['$scope', 'AuthService', 'RosettaService', 'dialogs', 'uiGridConstants', function($scope, AuthService, RosettaService, dialogs, uiGridConstants) {

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
            name: 'groups',
            field: 'groups',
            cellTemplate: '<div class="ui-grid-cell-contents"><span>{{row.entity.groups | ArrayAsString }}</span></div>'
        }, {
            name: 'refid',
            field: 'term.refid'
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
        },{
            name: 'contributingOrganization',
            field: 'contributingOrganization'
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
            sort: paginationOptions.sort
        }).then(function(result) {
            if (result !== null) {


                $scope.gridOptions.data = result.rosettas;
                $scope.gridOptions.totalItems = result.totalItems;
            }
        });

    };
    getPage();


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

angular.module('rtmms.rosetta').controller('RosettaModalInstanceController', ['$scope', '$modalInstance', 'Restangular', 'rosetta', 'RosettaService', 'UnitService', function($scope, $modalInstance, Restangular, rosetta, RosettaService, UnitService) {

    var formDataInitial;

    $scope.constraintType = 'units';


    UnitService.getUnitsAndUnitGroups().then(function(unitsAndUnitGroups) {
        $scope.unitsAndUnitGroups = unitsAndUnitGroups;
    });

    $scope.groups = [];
    $scope.tags = [];
    $scope.unitGroupIsExpanded = [];
    $scope.enumGroupIsExpanded = [];

    $scope.$watch('groups', function() {
        $scope.formData.groups = _.flatten(_.map($scope.groups, _.values));
    }, true);

    $scope.$watch('formData', function() {
        if (($scope.formData.unitGroups !== undefined && $scope.formData.unitGroups.length > 0) || ($scope.formData.units !== undefined && $scope.formData.units.length > 0)) {
            $scope.constraintType = 'units';
        } else if (($scope.formData.enumGroups !== undefined && $scope.formData.enumGroups.length > 0) || ($scope.formData.enums !== undefined && $scope.formData.enums.length > 0)) {
            $scope.constraintType = 'enums';
        } else {
            $scope.constraintType = null;
        }
    }, true);


    $scope.editmode = false;
    if (rosetta) {
        $scope.formData = rosetta;
        $scope.groups = rosetta.groups;
        formDataInitial = Restangular.copy(rosetta);
        $scope.editmode = true;

        //units and unitGroups table
        if ($scope.formData.unitGroups !== undefined) {
            for (i = 0; i < $scope.formData.unitGroups.length; i += 1) {
                $scope.unitGroupIsExpanded.push(false);
            }
        }

        //enums and enumGroups table
        if ($scope.formData.enumGroups !== undefined) {
            for (i = 0; i < $scope.formData.enumGroups.length; i += 1) {
                $scope.enumGroupIsExpanded.push(false);
            }
        }

    } else {
        $scope.refidType = "new";
        $scope.formData = {};
        $scope.editmode = false;
    }






    $scope.addRosetta = function() {
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

    $scope.editRosetta = function() {
        $modalInstance.close($scope.formData);
    };

    $scope.cancel = function() {
        // console.log($scope.formData);
        // console.log(formDataInitial);

        // $scope.formData.groups = formDataInitial.groups;
        // $scope.formData.vendorDescription = formDataInitial.vendorDescription;
        // $scope.formData.displayName = formDataInitial.displayName;
        // $scope.formData.vendorUom = formDataInitial.vendorUom;
        // $scope.formData.vendorVmd = formDataInitial.vendorVmd;
        // $scope.formData.refid = formDataInitial.refid;
        // $scope.formData.enums = formDataInitial.enums;

        $scope.formData = formDataInitial;

        $modalInstance.dismiss('cancel');
    };



    $scope.loadGroups = function(query) {
        return RosettaService.getRosettaGroups({
            'query': query
        }).then(function(groups) {
            return _.without(groups, $scope.formData.groups);
        });
    };

    $scope.loadTags = function(query) {
        return RosettaService.getRosettaTags({
            'query': query
        }).then(function(tags) {
            return _.without(tags, $scope.formData.tags);
        });
    };


    $scope.removeUnit = function(index, unit) {
        $scope.formData.units.splice(index, 1);
    };

    $scope.removeUnitGroup = function(index, unitGroup) {
        $scope.formData.unitGroups.splice(index, 1);
    };

    $scope.removeEnum = function(index, enumeration) {
        $scope.formData.enums.splice(index, 1);
    };

    $scope.removeEnumGroup = function(index, enumGroup) {
        $scope.formData.enumGroups.splice(index, 1);
    };

    $scope.selectUnitGroupRow = function(index, groupName) {
        $scope.unitGroupIsExpanded[index] = !$scope.unitGroupIsExpanded[index];
    };




    $scope.selectEnumGroupRow = function(index, groupName) {
        $scope.enumGroupIsExpanded[index] = !$scope.enumGroupIsExpanded[index];
    };


}]);
