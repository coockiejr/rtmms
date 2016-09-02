angular.module('rtmms.enum').controller('EnumValueController', ['$scope', '$http', 'AuthService', 'EnumService', function($scope, $http, AuthService, EnumService) {

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
            name: 'info',
            cellTemplate: ' <button class="glyphicon glyphicon-info-sign" ns-popover ns-popover-template="popover"  ns-popover-theme="ns-popover-theme " ns-popover-trigger="click" ns-popover-placement="right|top" >  </button>',
            width: 50
        }, {
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
                $scope.gridOptions.data = result.enums;
                $scope.gridOptions.totalItems = result.totalItems;
            }
        });

    };
    getPage();




    $scope.showAddEnumModal = function() {
        EnumService.showAddEnumModal().then(function(enumValue) {

            if (enumValue !== null) {
                $scope.gridOptions.data.unshift(enumValue);
            }
        });
    };

    $scope.showEditEnumModal = function(enumValue) {
        EnumService.showEditEnumModal(enumValue).then(function() {

        });
    };
    $scope.showAddCommentModal = function(enumValue) {
        EnumService.showAddCommentModal(enumValue).then(function() {

        });
    };
    $scope.downHTML = function() {

        $http.get('/api/downloadE/allHTML').then(function(res) {
            var blob = new Blob([res.data], {
                type: "text/plain;charset=utf-8"
            });
            saveAs(blob, "enum_terms.html");
        });
    };
    $scope.downXML = function() {

        $http.get('/api/downloadE/allXML').then(function(res) {
            var blob = new Blob([res.data], {
                type: "text/plain;charset=utf-8"
            });
            saveAs(blob, "enum_terms.xml");
        });
    };
    $scope.downCSV = function() {

        $http.get('/api/downloadE/allCSV').then(function(res) {
            var blob = new Blob([res.data], {
                type: "text/plain;charset=utf-8"
            });
            saveAs(blob, "enum_terms.csv");
        });
    };

    $scope.propose = function(enumValue) {
        if (enumValue.term.status === undefined) {
            enumValue.term.status = "proposed";
        } else {
            alert("Please select a term with a new refid");
        }

        EnumService.editEnum(enumValue);


    };
    $scope.proposeMap = function(enumValue) {
        if (enumValue.term.status === "pMapped") {
            enumValue.term.status = "rMapped";
        } else {
            alert("Please select a term with mapped refid");
        }

        EnumService.editEnum(enumValue);



    };



}]);




angular.module('rtmms.enum').controller('EnumModalInstanceController', ['$scope', '$modalInstance', 'Restangular', 'enumValue', 'EnumService', 'RosettaService', function($scope, $modalInstance, Restangular, enumValue, EnumService, RosettaService) {

    var formDataInitial;

    var getGroupAsObject = function(groupList) {
        EnumService.getEnumGroups().then(function(enumGroups) {

            $scope.formData.enumGroups = [];

            for (i = 0; i < enumGroups.enumGroups.length; i++) {
                for (t = 0; t < groupList.length; t++) {
                    if (enumGroups.enumGroups[i].groupName === groupList[t]) {
                        $scope.formData.enumGroups[t] = enumGroups.enumGroups[i];
                    }
                }
            }
        });
    };


    $scope.enumgroups = [];
    $scope.groups = [];
    $scope.tags = [];


    $scope.$watch('enumgroups', function() {
        $scope.groups = _.pluck($scope.enumgroups, 'text');

        getGroupAsObject($scope.groups);
    }, true);

    $scope.$watch('tags', function() {
        $scope.formData.tags = _.flatten(_.map($scope.tags, _.values));
    }, true);


    $scope.$watch('formData', function() {
        if (($scope.formData.enumGroups !== undefined && $scope.formData.enumGroups.length > 0) || ($scope.formData.enums !== undefined && $scope.formData.enums.length > 0)) {
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
    if (enumValue) {
        $scope.formData = enumValue;

        //enumValue.enumGroups=[];
        for (i = 0; i < enumValue.enumGroups.length; i++) {
            $scope.enumgroups[i] = enumValue.enumGroups[i].groupName;
        }
        $scope.tags = enumValue.tags;
        formDataInitial = Restangular.copy(enumValue);
        $scope.editmode = true;


    } else {
        $scope.formData = {};
        $scope.editmode = false;
    }


    $scope.addEnum = function() {
        if ($scope.formrosetta.$invalid) {
            return;
        }
        EnumService.createEnum($scope.formData);

        $modalInstance.dismiss('add');
    };

    $scope.editEnum = function() {
        $modalInstance.close($scope.formData);
    };

    $scope.cancel = function() {


        $scope.formData = formDataInitial;

        $modalInstance.dismiss('cancel');
    };



    $scope.loadGroups = function(query) {
        return EnumService.getEnumGroups({
            'query': query
        }).then(function(enumGroups) {

            for (i = 0; i < enumGroups.enumGroups.length; i++) {
                enumGroups.enumGroups[i] = enumGroups.enumGroups[i].groupName;
            }

            return _.without(enumGroups.enumGroups, $scope.formData.enumGroups);
        });
    };

    $scope.loadTags = function(query) {
        return EnumService.getEnumTags({
            'query': query
        }).then(function(tags) {

            return _.without(tags, $scope.formData.tags);
        });
    };



    $scope.removeEnum = function(index, enumeration) {
        $scope.formData.enums.splice(index, 1);
    };

    $scope.removeEnumGroup = function(index, enumGroup) {
        $scope.formData.enumGroups.splice(index, 1);
    };

    $scope.removeTerm = function(index, term) {

        delete $scope.formData.term.refid;
        delete $scope.formData.term.partition;
        delete $scope.formData.term.code10;
        delete $scope.formData.term.cfCode10;
        delete $scope.formData.term.status;
        //    delete $scope.formData.term;


    };





    $scope.selectEnumGroupRow = function(index, groupName) {
        $scope.enumGroupIsExpanded[index] = !$scope.enumGroupIsExpanded[index];
    };







}]);

angular.module('rtmms.enum').controller('EnumCommentModalInstanceController', ['$scope', '$modalInstance', 'Restangular', 'enumValue', 'RosettaService', 'EnumService', 'AuthService', function($scope, $modalInstance, Restangular, enumValue, RosettaService, EnumService, AuthService) {




    var formDataInitial;
    $scope.user = AuthService.isLoggedIn();

    //console.log(unitValue);



    if (enumValue) {
        $scope.comments = enumValue.comments;

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
        enumValue.comments.push(comment);
        $scope.comment = '';
        EnumService.editEnum(enumValue);
    };




    $scope.cancel = function() {

        $scope.formData = formDataInitial;

        $modalInstance.dismiss('cancel');
    };



}]);