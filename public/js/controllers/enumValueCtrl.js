angular.module('rtmms.enum').controller('EnumValueController', ['$scope', 'AuthService', 'EnumService', 'dialogs', function($scope, AuthService, EnumService, dialogs) {

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
            field: 'enums',
            cellTemplate: '<div class="ui-grid-cell-contents"><span>{{row.entity.enumGroups | EnumOrUnitGroupsAsString  }}</span></div>'
        }, {
            name: 'refid',
            field: 'term.refid'
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
   
   
}]);

angular.module('rtmms.enum').controller('EnumModalInstanceController', ['$scope', '$modalInstance','Restangular', 'enumValue', 'EnumService', 'RosettaService', function($scope, $modalInstance, Restangular, enumValue,  EnumService, RosettaService) {

     var formDataInitial;

    var getGroupAsObject=function(groupList){
        EnumService.getEnumGroups().then(function(enumGroups) {
           
                $scope.formData.enumGroups=[];
            
            for(i=0;i<enumGroups.enumGroups.length;i++){
                for(t=0;t<groupList.length;t++){
                    if( enumGroups.enumGroups[i].groupName===groupList[t]){
                           $scope.formData.enumGroups[t]=enumGroups.enumGroups[i];
                       } 
                }
            }
    });
    } ;


    $scope.enumgroups = [];
    $scope.groups=[];
    $scope.tags = [];
   

    $scope.$watch('enumgroups', function() {
        $scope.groups = _.pluck($scope.enumgroups,'text');

        getGroupAsObject($scope.groups);
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
        } if ($scope.formData.term.refid!==undefined && $scope.formData.term.partition===undefined){
            $scope.refidType='new';

        }if($scope.refidType==='new'){
            delete $scope.formData.term.partition;
            delete $scope.formData.term.code10;
            delete $scope.formData.term.cfCode10;
            $scope.status='pending';
        }  if( $scope.formData.term.partition!==undefined){
          $scope.refidType='existing';
        }
    }, true);


    $scope.editmode = false;
    if (enumValue) {
        $scope.formData = enumValue;

      //enumValue.enumGroups=[];
        for(i=0;i<enumValue.enumGroups.length;i++){
            $scope.enumgroups[i]=enumValue.enumGroups[i].groupName;
        }
        $scope.tags=enumValue.tags;
        formDataInitial = Restangular.copy(enumValue);
        $scope.editmode = true;
        

    } else {
        $scope.formData = {};
        $scope.editmode = false;
    }


    $scope.addEnum = function() {
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
           
            for(i=0;i<enumGroups.enumGroups.length;i++){
                enumGroups.enumGroups[i]=enumGroups.enumGroups[i].groupName;
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

     $scope.removeTerm = function(index, term) {

       delete $scope.formData.term.refid;
       delete $scope.formData.term.partition;
       delete $scope.formData.term.code10;
       delete $scope.formData.term.cfCode10;
       delete $scope.formData.term.status;
    //    delete $scope.formData.term;


    };

    $scope.selectUnitGroupRow = function(index, groupName) {
        $scope.unitGroupIsExpanded[index] = !$scope.unitGroupIsExpanded[index];
    };




    $scope.selectEnumGroupRow = function(index, groupName) {
        $scope.enumGroupIsExpanded[index] = !$scope.enumGroupIsExpanded[index];
    };







}]);
