angular.module('rtmms.rosetta').factory('HRosettaService', ['Restangular', '$modal', function(Restangular, $modal) {

    var factory = {};
    var HRosetta = Restangular.all('hrosettas');

    // =====================================
    // Rosetta API CALLS ===================
    // =====================================

    //retrieve Rosettas
    factory.getHRosettas = function(params) {
        return HRosetta.customGET("",params).then(function(hrosetta) {
            return hrosetta;
        });
    };


    //retrieve a Rosetta by id
    factory.getHRosetta = function(id) {
        return Restangular.one('hrosettas', id).get().then(
            function(rosetta) {
                return rosetta;
            },
            function(res) {
                console.log('Error: ' + res.status);
            });
    };

    //create a Rosetta
    factory.createRosetta = function(hrosetta) {
        return HRosetta.post(hrosetta).then(
            function(hrosetta) {},
            function(res) {
                console.log('Error: ' + res.status);
            });
    };

    //edit a Rosetta
    factory.editHRosetta = function(hrosetta) {
        hrosetta.save();
    };

    //delete a Rosetta
    factory.deleteHRosetta = function(hrosetta) {
        return hrosetta.remove().then(
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
                HRosetta: false
            }
        });

        return modalInstance.result.then(function(hrosetta) {
            factory.createHRosetta(hrosetta);
            return hrosetta;
        }, function() {
            return null;
        });
    };

    factory.retrieveRosettaForEdit = function(hrosetta) {
        if (hrosetta) {
            var modalInstance = $modal.open({
                templateUrl: 'views/modals/RosettaModal.html',
                controller: 'RosettaModalInstanceController',
                size: 'lg',
                resolve: {
                    hrosetta: function() {
                        return hrosetta;
                    }
                }
            });

            return modalInstance.result.then(function(hrosetta) {
                factory.editRosetta(hrosetta);
            }, function() {
                return null;
            });
        }
    };

    return factory;

}]);
