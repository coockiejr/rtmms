var app = angular.module('rtmms', ['rtmms.admin', 'rtmms.rosetta', 'rtmms.hRtm', 'rtmms.unit', 'rtmms.enum', 'rtmms.authentication', 'restangular', 'nsPopover', 'ngDropover', 'ui.bootstrap', 'ui.bootstrap.popover', 'ui.select', 'ui.grid', 'ui.grid.selection', 'ui.grid.pagination', 'ui.grid.resizeColumns', 'ui.grid.autoResize','ui.grid.draggable-rows','ui.grid.emptyBaseLayer', 'ngSanitize', 'ui.router', 'appRoutes', 'angular-loading-bar', 'angularUtils.directives.dirPagination', 'angulartics', 'ngTagsInput', 'toggle-switch', 'angulartics.google.analytics', 'ngAnimate', 'ngAria', 'ngMaterial']);


var adminModule = angular.module('rtmms.admin', []);
var rosettaModule = angular.module('rtmms.rosetta', []);
var hRosettaModule = angular.module('rtmms.hRtm', []);
var unitModule = angular.module('rtmms.unit', []);
var enumModule = angular.module('rtmms.enum', []);

var authenticationModule = angular.module('rtmms.authentication', []);

app.config(function(paginationTemplateProvider) {
    paginationTemplateProvider.setPath('views/templates/dirPagination.tpl.html');

});


app.run(['$http', 'AuthService', 'Restangular', function($http, AuthService, Restangular) {
    Restangular.setBaseUrl('/api/');
    Restangular.setRestangularFields({
        id: "_id"
    });

    $http.get("/api/login").then(function(data, status) {
        console.log("app.js");
        console.log(data);
        AuthService.setUser(data.data.user);
    },function(data) {
        $scope.message = data.data[0];
        $state.go('/login');
    });
}]);



angular.module('rtmms').controller('MainController', ['$scope', 'AuthService', '$state', function($scope, AuthService, $state) {
    $scope.$state = $state;

}]);