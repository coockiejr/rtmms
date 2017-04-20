angular.module('rtmms.rosetta').controller('RosettaController', ['$scope', 'AuthService', 'RosettaService', 'uiGridConstants', '$http', '$filter', function($scope, AuthService, RosettaService, uiGridConstants, $http, $filter) {

    $scope.authService = AuthService;
    $scope.$watch('authService.isLoggedIn()', function(user) {
        $scope.user = user;
    });
    $scope.showContent = false;



    var paginationOptions = {
        pageNumber: 1,
        pageSize: 25,
        sort: null,
        filters: null,
        contributingOrganization: undefined
    };
    $scope.vendor = function() {
        console.log($scope.co);
        if ($scope.co === "all") {
            paginationOptions.contributingOrganization = undefined;

        } else {
            var org = JSON.parse($scope.co);
            paginationOptions.contributingOrganization = org.name;
        }


        getPage();
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
                name: 'info',
                cellTemplate: ' <i class="fa fa-info" ns-popover ns-popover-template="popover" style="margin-left:10px;margin-right:10px"  ns-popover-theme="ns-popover-theme " ns-popover-trigger="click" ns-popover-placement="right|top" ></i>',
                width: 50
            }, {
                name: 'groups',
                field: 'groups',
                cellTemplate: '<div class="ui-grid-cell-contents"><span>{{row.entity.groups | ArrayAsString }}</span></div>'
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
                name: 'cfCode10',
                field: 'term.cfCode10'
            }, {
                name: 'standardTable',
                field: 'term.standardTable'
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
                name: 'code10',
                field: 'term.code10'
            }, {
                name: 'vendorDescription',
                field: 'vendorDescription'
            }, {
                name: 'displayName',
                field: 'displayName'
            }, {
                name: 'vendorUOM',
                field: 'vendorUom'
            },

            {
                name: 'UOM_MDC',
                field: 'units',
                cellTemplate: '<div class="ui-grid-cell-contents"><span class="bold">{{row.entity.unitGroups | EnumOrUnitGroupsAsString }}</span> <span>{{row.entity.units | UnitsAsString }}</span></div>',
                enableSorting: false
            }, {
                name: 'ucode10',
                field: 'units',
                cellTemplate: '<div class="ui-grid-cell-contents"> <span>{{row.entity.units | UCODEAsString }}</span></div>',
                enableSorting: false
            }, {
                name: 'cf_ucode10',
                field: 'units',
                cellTemplate: '<div class="ui-grid-cell-contents"> <span>{{row.entity.units | CFUCODEAsString }}</span></div>',
                enableSorting: false
            }, {
                name: 'ucums',
                field: 'ucums',
                cellTemplate: '<div class="ui-grid-cell-contents"><span>{{row.entity | UcumsAsStringFromRosetta }}</div>',
                enableSorting: false
            }, {
                name: 'contributingOrganization',
                field: 'contributingOrganization'
            }, {
                name: 'vendorStatus',
                field: 'vendorStatus'
            }, {
                name: 'vendorSort',
                field: 'vendorSort'
            }, {
                name: 'enums',
                field: 'enums',
                cellTemplate: '<div class="ui-grid-cell-contents"><span class="bold">{{row.entity.enumGroups | EnumOrUnitGroupsAsString }}</span> <span>{{row.entity.enums | EnumsAsString }}</span></div>',
                enableSorting: false
            }, {
                name: 'externalSites',
                field: 'externalSites',
                cellTemplate: '<div class="ui-grid-cell-contents"><span class="bold">{{row.entity.externalSiteGroups | EnumOrUnitGroupsAsString }}</span> <span>{{row.entity.externalSites | EnumsAsString }}</span></div>',
                enableSorting: false

            }, {
                name: 'vendorComment',
                field: 'vendorComment'
            }, {
                name: 'vendorVmd',
                field: 'vendorVmd'
            }
        ],
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
            $scope.gridApi.grid.registerRowsProcessor($scope.singleFilter, 200);


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
                    } else {
                        $scope.selectedEntity = null;
                    }
                });
            }

        }
    };
    $scope.singleFilter = function(renderableRows) {

        var matcher = new RegExp($scope.filterValue, "i");
        renderableRows.forEach(function(row) {
            var match = false;
            ['groups', 'term.refid', 'displayName'].forEach(function(field) {

                if (row.entity[field] && field === "groups") {

                    if (row.entity[field][0] && row.entity[field][0].match(matcher)) {
                        match = true;
                    }

                }
                if(field === " displayName"){
                    if (row.entity.displayName && row.entity.displayName.match(matcher)) {
                            match = true;
                        }
                }
                if (field === "term.refid" || field === "term.cfCode10") {
                    if (field === "term.refid") {
                        if (row.entity.term.refid && row.entity.term.refid.match(matcher)) {
                            match = true;
                        }
                    } 

                }


            });
            if (!match) {
                row.visible = false;
            }
        });
        return renderableRows;
    };

    $scope.refreshData = function() {
        $scope.gridApi.grid.refresh();
    };


    var getPage = function() {
        RosettaService.getRosettas({
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


        RosettaService.getCos({}).then(function(result) {
            if (result !== null) {
                $scope.cos = result.cos;

            }
        });
    };



    $scope.showAddCommentModal = function(rosetta) {
        RosettaService.showAddCommentModal(rosetta).then(function() {

        });
    };
    $scope.showEditRosettaModal = function(rosetta) {
        console.log(rosetta);
        RosettaService.showEditRosettaModal(rosetta).then(function() {

        });
    };
    $scope.deprecate = function(rosetta) {
        RosettaService.deprecateRosetta(rosetta).then(function() {
            getPage();
        });
    };


    $scope.downHTML = function() {

        $http.post('/api/downloadR/allHTML').then(function(res) {
            console.log(res);
            var blob = new Blob([res.data], {
                type: "text/plain;charset=utf-8"
            });
            saveAs(blob, "rosetta_terms.html");
        });
    };
    $scope.downXML = function() {

        $http.post('/api/downloadR/allXML').then(function(res) {
            var blob = new Blob([res.data], {
                type: "text/plain;charset=utf-8"
            });
            saveAs(blob, "rosetta_terms.xml");
        });
    };
    $scope.downXMLInView = function() {
        console.log($scope.gridOptions.data);
        $http({ method: "POST", url: '/api/downloadR/XMLInView', data: $scope.gridOptions.data, cache: false }).then(function(res) {
            console.log($scope.gridOptions.data);
            var blob = new Blob([res.data], {
                type: "text/plain;charset=utf-8"
            });
            saveAs(blob, "rosetta_terms.xml");
        });

    };
    $scope.downHtmlInView = function() {
        console.log($scope.gridOptions.data);
        $http({ method: "POST", url: '/api/downloadR/HTMLInView', data: $scope.gridOptions.data, cache: false }).then(function(res) {
            console.log($scope.gridOptions.data);
            var blob = new Blob([res.data], {
                type: "text/plain;charset=utf-8"
            });
            saveAs(blob, "rosetta_terms.html");
        });

    };
    $scope.downCSV = function() {

        $http.post('/api/downloadR/allCSV').then(function(res) {
            var blob = new Blob([res.data], {
                type: "text/plain;charset=utf-8"
            });
            saveAs(blob, "rosetta_terms.csv");
        });
    };
    $scope.downCSVInView = function() {

        $http({ method: "POST", url: '/api/downloadR/CSVInView', data: $scope.gridOptions.data, cache: false }).then(function(res) {
            var blob = new Blob([res.data], {
                type: "text/plain;charset=utf-8"
            });
            saveAs(blob, "rosetta_terms.csv");
        });
    };



}]);


angular.module('rtmms.rosetta').controller('CommentModalInstanceController', ['$scope', '$modalInstance', 'Restangular', 'rosetta', 'RosettaService', 'UnitService', 'AuthService', function($scope, $modalInstance, Restangular, rosetta, RosettaService, UnitService, AuthService) {




    var formDataInitial;
    $scope.user = AuthService.isLoggedIn();



    if (rosetta) {
        $scope.comments = rosetta.comments;

    }

    $scope.addComment = function() {

        var comment = {
            author: {
                _id: $scope.user._id,
                name: $scope.user.username,
                co: $scope.user.contributingOrganization.name
            },
            text: $scope.comment,
            date: Date.now()
        };
        rosetta.comments.push(comment);
        $scope.comment = '';
        RosettaService.editRosetta(rosetta);
    };



    $scope.addRosetta = function() {
        console.log($scope.formrosetta.$invalid);
        if ($scope.formrosetta.$invalid) {
            return;
        }
        RosettaService.createRosetta($scope.formData);
        $modalInstance.dismiss('add');

    };

    $scope.editRosetta = function() {
        console.log($scope.formData);
        $modalInstance.close($scope.formData);
    };


    $scope.cancel = function() {

        $scope.formData = formDataInitial;

        $modalInstance.dismiss('cancel');
    };



}]);