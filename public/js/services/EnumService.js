angular.module('rtmms.enum').factory('EnumService', ['Restangular', '$modal', function(Restangular, $modal) {

    var factory = {};
    var Enum = Restangular.all('enums');

    // =====================================
    // Rosetta API CALLS ===================
    // =====================================

    //retrieve Enum
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
