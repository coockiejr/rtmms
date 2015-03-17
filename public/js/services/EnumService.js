angular.module('rtmms.enum').factory('EnumService', ['Restangular', '$modal', function(Restangular, $modal) {

    var factory = {};
    var Enum = Restangular.all('enums');
    var EnumGroup = Restangular.all('enumgroups');

    // =====================================
    // ENUMERATION VALUES API CALLS ========
    // =====================================

    //retrieve Enums
    factory.getEnums = function(params) {
        return Enum.customGET("", params).then(function(result) {
            if (result.enums) {
                Restangular.restangularizeCollection(null, result.enums, 'enums');
            }
            return result;
        });
    };


    //retrieve a Enum by id
    factory.getEnum = function(id) {
        return Restangular.one('enums', id).get().then(
            function(enumValue) {
                return enumValue;
            },
            function(res) {
                console.log('Error: ' + res.status);
            });
    };

    //create a Enum
    factory.createEnum = function(enumValue) {
        return Rosetta.post(enumValue).then(
            function(enumValue) {},
            function(res) {
                console.log('Error: ' + res.status);
            });
    };

    //edit a Enum
    factory.editEnum = function(enumValue) {
        enumValue.put();
    };

    //delete a Enum
    factory.deleteEnum = function(enumValue) {
        return enumValue.remove().then(
            function() {},
            function(res) {
                console.log('Error: ' + res.status);
            });
    };

       //get enums ans enumGroups
    factory.getEnumsAndEnumGroups = function(params) {
        return Restangular.all('enumsandenumgroups').getList(params).then(
            function(enumsAndEnumGroups) {
                return enumsAndEnumGroups;
            },
            function(res) {
                console.log('Error: ' + res.status);
            });
    };

    // =====================================
    // ENUMERATION GROUPS API CALLS ========
    // =====================================

    //retrieve EnumGroups
    factory.getEnumGroups = function(params) {
        return EnumGroup.customGET("", params).then(function(result) {
            if (result.enumgroups) {
                Restangular.restangularizeCollection(null, result.enumgroups, 'enumgroups');
            }
            return result;
        });
    };


    //retrieve a EnumGroup by id
    factory.getEnumGroup = function(id) {
        return Restangular.one('enumgroups', id).get().then(
            function(enumValue) {
                return enumValue;
            },
            function(res) {
                console.log('Error: ' + res.status);
            });
    };

    //create a Enum
    factory.createEnum = function(enumValue) {
        return EnumGroup.post(enumValue).then(
            function(enumValue) {},
            function(res) {
                console.log('Error: ' + res.status);
            });
    };

    //edit a Enum
    factory.editEnum = function(enumGroup) {
        enumGroup.put();
    };

    //delete a Enum
    factory.deleteEnum = function(enumGroup) {
        return enumGroup.remove().then(
            function() {},
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
