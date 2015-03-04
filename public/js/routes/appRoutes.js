angular.module('appRoutes', []).config(function($stateProvider, $urlRouterProvider) {
    //
    // For any unmatched url, redirect to /state1
    $urlRouterProvider.otherwise("/");
    //
    // Now set up the states
    $stateProvider
        .state('/', {
            url: "/",
            templateUrl: "views/templates/pages/home.tpl.html",
            controller: 'HomeController'
        }).state('/login', {
            url: "/login",
            templateUrl: "views/templates/pages/login.tpl.html",
            controller: 'LoginController'
        }).state('/signup', {
            url: "/signup",
            templateUrl: "views/templates/pages/signup.tpl.html",
            controller: 'SignUpController'
        }).state('/profile', {
            url: "/profile",
            templateUrl: "views/templates/pages/profile.tpl.html",
            controller: 'ProfileController'
        }).state('/rosetta', {
            url: "/rosetta",
            templateUrl: "views/templates/pages/rosetta.tpl.html",
            controller: 'RosettaController'
        }).state('/hRtm', {
            url: "/hRtm",
            templateUrl: "views/templates/pages/hRtm.tpl.html",
            controller: 'HarmonizedRosettaController'
        }).state('/units', {
            url: "/units",
            templateUrl: "views/templates/pages/units/units.tpl.html",
            controller: 'UnitController'
        }).state('/unitGroups', {
            url: "/unitGroups",
            templateUrl: "views/templates/pages/units/unitGroups.tpl.html",
            controller: 'UnitGroupController'
        }).state('/enumValues', {
            url: "/enumValues",
            templateUrl: "views/templates/pages/enumerations/enumValues.tpl.html",
            controller: 'EnumValueController'
        }).state('/enumGroups', {
            url: "/enumGroups",
            templateUrl: "views/templates/pages/enumerations/enumGroups.tpl.html",
            controller: 'EnumGroupController'
        });

});
