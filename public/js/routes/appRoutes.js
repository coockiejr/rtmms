angular.module('appRoutes', []).config(function($stateProvider, $urlRouterProvider) {
    //
    // For any unmatched url, redirect to /state1
    $urlRouterProvider.otherwise("/");
    //
    // Now set up the states
    $stateProvider
        .state('/', {
            url: "/",
            templateUrl: "views/home.html",
            controller: 'HomeController'
        }).state('/login', {
            url: "/login",
            templateUrl: "views/login.html",
            controller: 'LoginController'
        }).state('/signup', {
            url: "/signup",
            templateUrl: "views/signup.html",
            controller: 'SignUpController'
        }).state('/profile', {
            url: "/profile",
            templateUrl: "views/profile.html",
            controller: 'ProfileController'
        }).state('/rosetta', {
            url: "/rosetta",
            templateUrl: "views/rosetta.html",
            controller: 'RosettaController'
        }).state('/hRtm', {
            url: "/hRtm",
            templateUrl: "views/hRtm.html",
            controller: 'HarmonizedRosettaController'
        }).state('/units', {
            url: "/units",
            templateUrl: "views/units.html",
            controller: 'UnitController'
        }).state('/enums', {
            url: "/enums",
            templateUrl: "views/enums.html",
            controller: 'EnumController'
        });

});
