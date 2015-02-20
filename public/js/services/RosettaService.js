angular.module('rtmms.rosetta').factory('RosettaService', ['Restangular', '$modal', function(Restangular, $modal) {

    var factory = {};
    var Rosetta = Restangular.all('rosettas');

    // =====================================
    // Rosetta API CALLS ===================
    // =====================================

    //retrieve Rosetta
    factory.getRosettas = function(params) {
        return Rosetta.getList(params).then(function(rosettas) {
            return rosettas;
        });
    };


    //retrieve a Rosetta by id
    factory.getRosetta = function(id) {
        return Restangular.one('rosettas', id).get().then(
            function(rosetta) {
                return rosetta;
            },
            function(res) {
                console.log('Error: ' + res.status);
            });
    };

    //create a Rosetta
    factory.createRosetta = function(rosetta) {
        return Rosetta.post(rosetta).then(
            function(rosetta) {},
            function(res) {
                console.log('Error: ' + res.status);
            });
    };

    //edit a Rosetta
    factory.editRosetta = function(rosetta) {
        rosetta.save();
    };

    //delete a Rosetta
    factory.deleteRosetta = function(rosetta) {
        return rosetta.remove().then(
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
            templateUrl: 'views/modals/RosettaModal.html',
            controller: 'RosettaModalInstanceController',
            size: 'lg',
            resolve: {
                Rosetta: false
            }
        });

        return modalInstance.result.then(function(Rosetta) {
            factory.createRosetta(Rosetta);
            return Rosetta;
        }, function() {
            return null;
        });
    };

    factory.retrieveRosettaForEdit = function(rosetta) {
        if (Rosetta) {
            var modalInstance = $modal.open({
                templateUrl: 'views/modals/RosettaModal.html',
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
