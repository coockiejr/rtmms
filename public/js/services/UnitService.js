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
        return Rosetta.post(unitValue).then(
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
    factory.createUnit = function(unitValue) {
        return UnitGroup.post(unitValue).then(
            function(unitValue) {},
            function(res) {
                console.log('Error: ' + res.status);
            });
    };

    //edit a Unit
    factory.editUnit = function(unitGroup) {
        unitGroup.put();
    };

    //delete a Unit
    factory.deleteUnit = function(unitGroup) {
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


    // =====================================
    // Rosetta MODALS ======================
    // =====================================

    factory.showAddRosettaModal = function() {
        var modalInstance = $modal.open({
            templateUrl: 'views/templates/modals/rosettaModal.tpl.html',
            controller: 'RosettaModalInstanceController',
            size: 'lg',
            resolve: {
                rosetta: false
            }
        });

        return modalInstance.result.then(function(Rosetta) {
            factory.createRosetta(Rosetta);
            return Rosetta;
        }, function() {
            return null;
        });
    };

    factory.showEditRosettaModal = function(rosetta) {
        if (Rosetta) {
            var modalInstance = $modal.open({
                templateUrl: 'views/templates/modals/rosettaModal.tpl.html',
                controller: 'RosettaModalInstanceController',
                size: 'lg',
                resolve: {
                    rosetta: function() {
                        return rosetta;
                    }
                }
            });

            return modalInstance.result.then(function(rosetta) {
                factory.editRosetta(rosetta);
            }, function() {
                return null;
            });
        }
    };

    return factory;

}]);
