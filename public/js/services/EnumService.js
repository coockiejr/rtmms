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
        return Enum.post(enumValue).then(
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

     factory.getEnumRefids = function(params) {
        return Restangular.all('enumrefids').getList(params).then(
            function(refids) {
                return refids;
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
    factory.createEnumGroup = function(enumGroup) {
        return EnumGroup.post(enumGroup).then(
            function(enumGroup) {},
            function(res) {
                console.log('Error: ' + res.status);
            });
    };

    //edit a Enum
    factory.editEnumGroup = function(enumGroup) {
        enumGroup.put();
    };

    //delete a Enum
    factory.deleteEnumGroup = function(enumGroup) {
        return enumGroup.remove().then(
            function() {},
            function(res) {
                console.log('Error: ' + res.status);
            });
    };



     //get enum tags
    factory.getEnumTags = function(params) {
        return Restangular.all('enumtags').getList(params).then(
            function(tags) {
                return tags;
            },
            function(res) {
                console.log('Error: ' + res.status);
            });
    };

    // =====================================
    // Enum MODALS ======================
    // =====================================

    factory.showAddEnumModal = function() {
        var modalInstance = $modal.open({
            templateUrl: 'views/templates/modals/enumModal.tpl.html',
            controller: 'EnumModalInstanceController',
            size: 'lg',
            resolve: {
                enumValue: false
            }
        });

        return modalInstance.result.then(function(enumValue) {
            factory.createEnum(enumValue);
            return enumValue;
        }, function() {
            return null;
        });
    };

    factory.showEditEnumModal = function(enumValue) {
        if (Enum) {
            var modalInstance = $modal.open({
                templateUrl: 'views/templates/modals/enumModal.tpl.html',
                controller: 'EnumModalInstanceController',
                size: 'lg',
                resolve: {
                    enumValue: function() {
                        return enumValue;
                    }
                }
            });

            return modalInstance.result.then(function(enumValue) {
                factory.editEnum(enumValue);
            }, function() {
                return null;
            });
        }
    };

    factory.showAssignRefidModal = function(enumValue) {
        if (Enum) {
            var modalInstance = $modal.open({
                templateUrl: 'views/templates/modals/refidAssignModal.tpl.html',
                controller: 'ERefidModalInstanceController',
                size: 'lg',
                resolve: {
                    enumValue: function() {
                        return enumValue;
                    }
                }
            });

            return modalInstance.result.then(function(enumValue) {
                factory.editEnum(enumValue);
            }, function() {
                return null;
            });
        }
    };

    factory.showReadyRefidModal = function(enumValue) {
        if (Enum) {
            var modalInstance = $modal.open({
                templateUrl: 'views/templates/modals/refidModal.tpl.html',
                controller: 'ERefidModalInstanceController',
                size: 'lg',
                resolve: {
                    enumValue: function() {
                        return enumValue;
                    }
                }
            });

            return modalInstance.result.then(function(enumValue) {
                factory.editEnum(enumValue);
            }, function() {
                return null;
            });
        }
    };

    // ====================================
    // Comment MODALS ======================
    // =====================================

    
    factory.showAddCommentModal = function(enumValue) {
        if (Enum) {
            var modalInstance = $modal.open({
                templateUrl: 'views/templates/modals/commentModal.tpl.html',
                controller: 'EnumCommentModalInstanceController',
                size: 'lg',
                resolve: {
                    enumValue: function() {
                        return enumValue;
                    }
                }
            });

            return modalInstance.result.then(function(enumValue) {
                factory.editEnum(enumValue);
            }, function() {
                return null;
            });
        }
    };


    return factory;

}]);
