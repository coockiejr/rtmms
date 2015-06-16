angular.module('rtmms.unit').factory('UnitService', ['Restangular', '$modal', function(Restangular, $modal) {

    var factory = {};
    var Unit = Restangular.all('units');
    var UnitGroup = Restangular.all('unitgroups');

    // =====================================
    // Unit VALUES API CALLS ===============
    // =====================================

    //retrieve Units
    factory.getUnits = function(params) {
        return Unit.customGET("", params).then(function(result) {
            if (result.units) {
                Restangular.restangularizeCollection(null, result.units, 'units');
            }
            return result;
        });
    };


    //retrieve a Unit by id
    factory.getUnit = function(id) {
        return Restangular.one('units', id).get().then(
            function(unitValue) {
                return unitValue;
            },
            function(res) {
                console.log('Error: ' + res.status);
            });
    };


    //create a Unit
    factory.createUnit = function(unitValue) {
        return Unit.post(unitValue).then(
            function(unitValue) {},
            function(res) {
                console.log('Error: ' + res.status);
            });
    };

    //edit a Unit
    factory.editUnit = function(unitValue) {
      
        unitValue.put();
    };

    //delete a Unit
    factory.deleteUnit = function(unitValue) {
        return unitValue.remove().then(
            function() {},
            function(res) {
                console.log('Error: ' + res.status);
            });
    };

    // =====================================
    // UNIT GROUPS API CALLS ===============
    // =====================================

    //retrieve UnitGroups
    factory.getUnitGroups = function(params) {
        return UnitGroup.customGET("", params).then(function(result) {
            if (result.unitgroups) {
                Restangular.restangularizeCollection(null, result.unitgroups, 'unitgroups');
            }
          //  console.log(result);
            return result;
        });
    };



    //retrieve a UnitGroup by id
    factory.getUnitGroup = function(id) {
        return Restangular.one('unitgroups', id).get().then(
            function(unitValue) {
                return unitValue;
            },
            function(res) {
                console.log('Error: ' + res.status);
            });
    };

  

    //create a Unit
    factory.createUnitGroup = function(unitGroup) {
        return UnitGroup.post(unitGroup).then(
            function(unitGroup) {},
            function(res) {
                console.log('Error: ' + res.status);
            });
    };

    //edit a Unit
    factory.editUnitGroup = function(unitGroup) {
        unitGroup.put();
    };

    //delete a Unit
    factory.deleteUnitGroup = function(unitGroup) {
        return unitGroup.remove().then(
            function() {},
            function(res) {
                console.log('Error: ' + res.status);
            });
    };


    //get units ans UnitGroups
    factory.getUnitsAndUnitGroups = function(params) {
        return Restangular.all('unitsandunitgroups').getList(params).then(
            function(unitsAndUnitGroups) {
                return unitsAndUnitGroups;
            },
            function(res) {
                console.log('Error: ' + res.status);
            });
    };

    //get unit ucums
    factory.getUnitUcums = function(params) {
        return Restangular.all('unitucums').getList(params).then(
            function(unitUcums) {
                return unitUcums;
            },
            function(res) {
                console.log('Error: ' + res.status);
            });
    };

     //get unit tags
    factory.getUnitTags = function(params) {
        return Restangular.all('unittags').getList(params).then(
            function(tags) {
                return tags;
            },
            function(res) {
                console.log('Error: ' + res.status);
            });
    };
    // =====================================
    // Rosetta MODALS ======================
    // =====================================

     factory.showAddUnitModal = function() {
        var modalInstance = $modal.open({
            templateUrl: 'views/templates/modals/unitModal.tpl.html',
            controller: 'UnitModalInstanceController',
            size: 'lg',
            resolve: {
                unitValue: false
            }
        });

        return modalInstance.result.then(function(unitValue) {
            factory.createUnit(unitValue);
            return unitValue;
        }, function() {
            return null;
        });
    };

    factory.showEditUnitModal = function(unitValue) {
        if (Unit) {
            var modalInstance = $modal.open({
                templateUrl: 'views/templates/modals/unitModal.tpl.html',
                controller: 'UnitModalInstanceController',
                size: 'lg',
                resolve: {
                    unitValue: function() {
                        return unitValue;
                    }
                }
            });

            return modalInstance.result.then(function(unitValue) {
                factory.editUnit(unitValue);
            }, function() {
                return null;
            });
        }
    };
    return factory;

}]);
