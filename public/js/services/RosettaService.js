angular.module('rtmms.rosetta').factory('RosettaService', ['Restangular', '$modal', function(Restangular, $modal) {

    var factory = {};
    var Rosetta = Restangular.all('rosettas');
    var MyRosetta = Restangular.all('myrosettas');
    var Co = Restangular.all('cos');

    // =====================================
    // Rosetta API CALLS ===================
    // =====================================

    //retrieve Rosettas
    factory.getRosettas = function(params) {
        return Rosetta.customGET("", params).then(function(result) {
            if (result.rosettas) {
                Restangular.restangularizeCollection(null, result.rosettas, 'rosettas');
            }
            return result;
        });
    };

    //retrieve myRosettas
    factory.getMyRosettas = function(params) {
        return MyRosetta.customGET("", params).then(function(result) {
            if (result.rosettas) {
                Restangular.restangularizeCollection(null, result.rosettas, 'myrosettas');
            }
            return result;
        });
    };
    factory.getCos = function(params) {
        return Co.customGET("", params).then(function(result) {
            if (result.cos) {
                Restangular.restangularizeCollection(null, result.cos, 'cos');
            }
            return result;
        });
    };
    factory.createCo = function(co) {
        return Co.post('/api/addCo/' + co).then(
            function(co) {},
            function(res) {
                console.log('Error: ' + res.status);
            });
    };
    factory.editCo = function(co) {
        co.put();
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
        console.log(rosetta);
        return Rosetta.post(rosetta).then(
            function(rosetta) {},
            function(res) {
                console.log('Error: ' + res.status);
            });
    };

    //edit a Rosetta
    factory.editRosetta = function(rosetta) {
        rosetta.put();
    };

    //delete a Rosetta
    factory.deleteRosetta = function(rosetta) {
        return rosetta.remove().then(
            function() {},
            function(res) {
                console.log('Error: ' + res.status);
            });
    };


    //get rosetta groups
    factory.getRosettaGroups = function(params) {
        return Restangular.all('rosettagroups').getList(params).then(
            function(groups) {
                return groups;
            },
            function(res) {
                console.log('Error: ' + res.status);
            });
    };

    factory.getRosettaRefids = function(params) {
        return Restangular.all('rosettarefids').getList(params).then(
            function(refids) {
                return refids;
            },
            function(res) {
                console.log('Error: ' + res.status);
            });
    };
    //get rosetta tags
    factory.getRosettaTags = function(params) {
        return Restangular.all('rosettatags').getList(params).then(
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

    factory.showAddRosettaModal = function() {
        var modalInstance = $modal.open({
            templateUrl: 'views/templates/modals/rosettaModal.tpl.html',
            controller: 'RosettaModalInstanceController',
            size: 'lg',
            resolve: {
                rosetta: false
            }
        });

        return modalInstance.result.then(function(rosetta) {
            factory.createRosetta(rosetta);
            return rosetta;
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
                console.log(rosetta);
                factory.editRosetta(rosetta);
            }, function() {
                return null;
            });
        }
    };
    factory.showAddCOModal = function() {
        var modalInstance = $modal.open({
            templateUrl: 'views/templates/modals/coModal.tpl.html',
            controller: 'CoModalInstanceController',
            size: 'lg',
            resolve: {
                co: false
            }
        });

        return modalInstance.result.then(function(co) {
            factory.createCo(co);
            return co;
        }, function() {
            return null;
        });
    };
    factory.showEditCOModal = function(co) {
        if (Co) {
            var modalInstance = $modal.open({
                templateUrl: 'views/templates/modals/coModal.tpl.html',
                controller: 'CoModalInstanceController',
                size: 'lg',
                resolve: {
                    co: function() {
                        return co;
                    }
                }
            });

            return modalInstance.result.then(function(co) {
                factory.editCo(co);
            }, function() {
                return null;
            });
        }
    };

    factory.showAssignRefidModal = function(rosetta) {
        if (Rosetta) {
            var modalInstance = $modal.open({
                templateUrl: 'views/templates/modals/refidAssignModal.tpl.html',
                controller: 'RefidModalInstanceController',
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

    factory.showReadyRefidModal = function(rosetta) {
        if (Rosetta) {
            var modalInstance = $modal.open({
                templateUrl: 'views/templates/modals/refidModal.tpl.html',
                controller: 'RefidModalInstanceController',
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

    factory.showRegisterRefidModal = function(rosetta) {
        if (Rosetta) {
            var modalInstance = $modal.open({
                templateUrl: 'views/templates/modals/refidRegisterModal.tpl.html',
                controller: 'RefidModalInstanceController',
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
    // ====================================
    // Comment MODALS ======================
    // =====================================


    factory.showAddCommentModal = function(rosetta) {
        if (Rosetta) {
            var modalInstance = $modal.open({
                templateUrl: 'views/templates/modals/commentModal.tpl.html',
                controller: 'CommentModalInstanceController',
                size: 'lg',
                resolve: {
                    rosetta: function() {
                        return rosetta;
                    }
                }
            });

            return modalInstance.result.then(function(rosetta) {
                console.log(rosetta);
                factory.editRosetta(rosetta);
            }, function() {
                return null;
            });
        }
    };

    return factory;

}]);