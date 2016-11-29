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
        }).state('/logout', {
            url: "/",
            controller: 'LogoutController'
        }).state('/signup', {
            url: "/signup",
            templateUrl: "views/templates/pages/signup.tpl.html",
            controller: 'SignUpController'
        }).state('/profile', {
            url: "/profile",
            templateUrl: "views/templates/pages/profile.tpl.html",
            controller: 'ProfileController'
        }).state('/users', {
            url: "/users",
            templateUrl: "views/templates/pages/users.tpl.html",
            controller: 'UsersController'
        }).state('/forgot', {
            url: "/forgot",
            templateUrl: "views/templates/pages/forgot.tpl.html",
            controller: 'ForgotController'
        }).state('/contact', {
            url: "/contact",
            templateUrl: "views/templates/pages/contact.tpl.html",
            controller: 'ContactController'
        }).state('/co', {
            url: "/co",
            templateUrl: "views/templates/pages/co.tpl.html",
            controller: 'CoController'
        }).state('/termApproval', {
            url: "/termApproval",
            templateUrl: "views/templates/pages/termApproval.tpl.html",
            controller: 'TermApprovalController'
        }).state('/x73', {
            url: "/x73",
            templateUrl: "views/templates/pages/x73.tpl.html",
            controller: 'X73Controller'
        }).state('/coRosetta', {
            url: "/coRosetta",
            templateUrl: "views/templates/pages/coRosetta.tpl.html",
            controller: 'CoRosettaController'
        }).state('/myRosetta', {
            url: "/myRosetta",
            templateUrl: "views/templates/pages/myRosetta.tpl.html",
            controller: 'MyRosettaController'
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
            controller: 'UnitController',
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