angular.module('rtmms.unit').controller('UnitController', ['$scope', 'AuthService', 'UnitService', 'dialogs', function($scope, AuthService, UnitService, dialogs) {

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
            name: 'unitGroups',
            field: 'unitGroups',
            cellTemplate: '<div class="ui-grid-cell-contents"><span>{{row.entity.unitGroups | EnumOrUnitGroupsAsString }}</span></div>'
        }, {
            name: 'refid',
            field: 'term.refid'
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
            name: 'unitOfMeasure',
            field: 'unitOfMeasure'
        },  {
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
        UnitService.getUnits({
            limit: paginationOptions.pageSize,
            skip: (paginationOptions.pageNumber - 1) * paginationOptions.pageSize,
            filters: paginationOptions.filters,
            sort: paginationOptions.sort
        }).then(function(result) {
            if (result !== null) {
                $scope.gridOptions.data = result.units;
                $scope.gridOptions.totalItems = result.totalItems;
            }
        });

    };
    getPage();


    $scope.showAddUnitModal = function() {
        UnitService.showAddUnitModal().then(function(unitValue) {

            if (unitValue !== null) {
                $scope.gridOptions.data.unshift(unitValue);
            }
        });
    };

    $scope.showEditUnitModal = function(unitValue) {
        UnitService.showEditUnitModal(unitValue).then(function() {

        });
    };
   
   
}]);

angular.module('rtmms.unit').controller('UnitModalInstanceController', ['$scope', '$modalInstance','Restangular', 'unitValue', 'UnitService', 'RosettaService', function($scope, $modalInstance, Restangular, unitValue,  UnitService, RosettaService) {

     var formDataInitial;

     var getGroupAsObject=function(groupList){
        UnitService.getUnitGroups().then(function(unitGroups) {
           
                $scope.formData.unitGroups=[];
            
            for(i=0;i<unitGroups.unitGroups.length;i++){
                for(t=0;t<groupList.length;t++){
                    if( unitGroups.unitGroups[i].groupName===groupList[t]){
                           $scope.formData.unitGroups[t]=unitGroups.unitGroups[i];
                       } 
                }
            }
    });
    } ;

  
    $scope.unitgroups = [];
    $scope.groups=[];
    $scope.tags = [];
    $scope.ucumIsExpanded=[];



    $scope.$watch('unitgroups', function() {
      //  console.log($scope.unitgroups);
        $scope.groups = _.pluck($scope.unitgroups,'text');

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
    if (unitValue) {
        $scope.formData = unitValue;
     //  console.log($scope.formData.ucums);

      //unitValue.unitGroups=[];
        for(i=0;i<unitValue.unitGroups.length;i++){
            $scope.unitgroups[i]=unitValue.unitGroups[i].groupName;
        }
        $scope.tags=unitValue.tags;
        formDataInitial = Restangular.copy(unitValue);
        $scope.editmode = true;

      
        //ucums table
        if ($scope.formData.ucums !== undefined) {
            for (i = 0; i < $scope.formData.ucums.length; i += 1) {
                $scope.ucumIsExpanded.push(false);
            }
        }

      

    } else {
        $scope.formData = {};
        $scope.editmode = false;
    }


    $scope.addUnit = function() {

     UnitService.createUnit($scope.formData);


        $modalInstance.dismiss('add');
    };

    $scope.editUnit = function() {
        $modalInstance.close($scope.formData);
    };

    $scope.cancel = function() {

        $scope.formData = formDataInitial;

        $modalInstance.dismiss('cancel');
    };



    $scope.loadGroups = function(query) {
        return UnitService.getUnitGroups({
            'query': query
        }).then(function(unitGroups) {
            
            for(i=0;i<unitGroups.unitGroups.length;i++){
              unitGroups.unitGroups[i]=unitGroups.unitGroups[i].groupName;
            }
           
           return _.without(unitGroups.unitGroups,$scope.formData.unitGroups);

        });
    };



    $scope.loadTags = function(query) {
        return UnitService.getUnitTags({
            'query': query
        }).then(function(tags) {
            
            return _.without(tags, $scope.formData.tags);
        });
    };




   
     $scope.removeUcum = function(index, ucum) {
        $scope.formData.ucums.splice(index, 1);
    };

    $scope.removeTerm = function(index, term) {

       delete $scope.formData.term.refid;
       delete $scope.formData.term.partition;
       delete $scope.formData.term.code10;
       delete $scope.formData.term.cfCode10;
       delete $scope.formData.term.status;
    //    delete $scope.formData.term;


    };
      $scope.selectUcumRow = function(index, ucum) {
        $scope.ucumIsExpanded[index] = !$scope.ucumIsExpanded[index];
    };








}]);
