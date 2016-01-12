angular.module('rtmms.rosetta').controller('MyRosettaController', ['$scope','$http', 'AuthService', 'RosettaService', 'dialogs', 'uiGridConstants', function($scope,$http, AuthService, RosettaService, dialogs, uiGridConstants) {

    $scope.authService = AuthService;
    $scope.$watch('authService.isLoggedIn()', function(user) {
        $scope.user = user;
    });


    $scope.user = AuthService.isLoggedIn();


    var paginationOptions = {
        pageNumber: 1,
        pageSize: 25,
        sort: null,
        filters: null,
        contributingOrganization: $scope.user.contributingOrganization.name
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
            cellTemplate:' <button class="glyphicon glyphicon-info-sign" ns-popover ns-popover-template="popover"  ns-popover-theme="ns-popover-theme " ns-popover-trigger="click" ns-popover-placement="right|top" >  </button>',
            width:50
        },{
            name: 'groups',
            field: 'groups',
            cellTemplate: '<div class="ui-grid-cell-contents"><span>{{row.entity.groups | ArrayAsString }}</span></div>'
        },{
            name: 'refid',
            field: 'term.refid',
            cellTemplate: '<div class="ui-grid-cell-contents" data-toggle="tooltip" data-placement="top" title={{row.entity.term.status}}><span>{{row.entity.term.refid}}</span></div>',
            cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {

                if (row.entity.term !== undefined) {
                    if (row.entity.term.status === undefined||row.entity.term.status ==="pMapped") {

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

                $scope.rosettas=result.rosettas;
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
    $scope.propose = function(rosetta) {
        if (rosetta.term.status === undefined) {
            rosetta.term.status = "proposed";
        } else {
            alert("Please select a term with a new refid");
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

    $scope.download=function(rosetta){
       
        $http.get('/api/downloadR/'+rosetta._id).then(function(res){
            window.location = "test.xml";
        });
    };
     $scope.downHTML=function(){
       
        $http.get('/api/downloadR/allHTML').then(function(res){
            var blob = new Blob([res.data], {type: "text/plain;charset=utf-8"});
            saveAs(blob,"rosetta_terms.html");
        });
    };
     $scope.downXML=function(){
       
        $http.get('/api/downloadR/allXML').then(function(res){
            var blob = new Blob([res.data], {type: "text/plain;charset=utf-8"});
            saveAs(blob,"rosetta_terms.xml");
        });
    };
    $scope.downCSV=function(){
       
        $http.get('/api/downloadR/allCSV').then(function(res){
            var blob = new Blob([res.data], {type: "text/plain;charset=utf-8"});
            saveAs(blob,"rosetta_terms.csv");
        });
    };
}]);

angular.module('rtmms.rosetta').controller('RosettaModalInstanceController', ['$scope', '$modalInstance', 'Restangular', 'rosetta', 'RosettaService', 'UnitService', 'AuthService', function($scope, $modalInstance, Restangular, rosetta, RosettaService, UnitService, AuthService) {

    var formDataInitial;
    $scope.user = AuthService.isLoggedIn();
    $scope.constraintType = 'units';


    UnitService.getUnitsAndUnitGroups().then(function(unitsAndUnitGroups) {
        $scope.unitsAndUnitGroups = unitsAndUnitGroups;
    });

    $scope.groups = [];
    $scope.refid = [];
    $scope.tags = [];
    $scope.unitGroupIsExpanded = [];
    $scope.enumGroupIsExpanded = [];

    $scope.$watch('groups', function() {
        $scope.formData.groups = _.flatten(_.map($scope.groups, _.values));

    }, true);

    $scope.$watch('tags', function() {

        $scope.formData.tags = _.flatten(_.map($scope.tags, _.values));
    }, true);



    $scope.$watch('formData', function() {
        if (($scope.formData.unitGroups !== undefined && $scope.formData.unitGroups.length > 0) || ($scope.formData.units !== undefined && $scope.formData.units.length > 0)) {
            $scope.constraintType = 'units';
        } else if (($scope.formData.enumGroups !== undefined && $scope.formData.enumGroups.length > 0) || ($scope.formData.enums !== undefined && $scope.formData.enums.length > 0)) {
            $scope.constraintType = 'enums';
        } else {
            $scope.constraintType = null;
        }
        if ($scope.formData.term !== undefined) {
            if ($scope.formData.term.refid !== undefined && $scope.formData.term.partition === undefined) {
                $scope.refidType = 'new';

            }
        }

        if ($scope.refidType === 'new') {
            delete $scope.formData.term.partition;
            delete $scope.formData.term.code10;
            delete $scope.formData.term.cfCode10;

            $scope.status = 'pending';
        }
        if ($scope.formData.term !== undefined) {
            if ($scope.formData.term.partition !== undefined) {
                $scope.refidType = 'existing';
            }
        }

        if ($scope.refidType === 'existing') {
            $scope.formrosetta.$invalid = false;
            if ($scope.formData.term.status !== undefined) {
                $scope.formData.term.status = "pMapped";

            }
        }

    }, true);


    $scope.editmode = false;
    if (rosetta) {
        $scope.formData = rosetta;
        $scope.groups = rosetta.groups;
        $scope.tags = rosetta.tags;
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
        $scope.formData = {};
        $scope.formData.contributingOrganization ={
            _id:$scope.user.contributingOrganization._id,
            name: $scope.user.contributingOrganization.name
        };
        console.log($scope.formData);
        $scope.editmode = false;
    }



    $scope.addRosetta = function() {
        if ($scope.formrosetta.$invalid) {
            return;
        }
        //$scope.formData.term.status="proposed";
        RosettaService.createRosetta($scope.formData);
        $modalInstance.dismiss('add');

    };

    $scope.editRosetta = function() {
        $modalInstance.close($scope.formData);
    };

    $scope.cancel = function() {

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
    $scope.removeTerm = function(index, term) {




        delete $scope.formData.term.refid;
        delete $scope.formData.term.partition;
        delete $scope.formData.term.code10;
        delete $scope.formData.term.cfCode10;
        delete $scope.formData.term.status;
        //    delete $scope.formData.term;


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
