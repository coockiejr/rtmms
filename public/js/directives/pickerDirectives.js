var app = angular.module('rtmms');


app.directive('unitsPicker', ['$timeout', '$document', 'UnitService', function($timeout, $document, UnitService) {
    return {
        restrict: 'A',
        scope: {
            unitGroupsList: '=unitgroups',
            unitsList: '=units',
            limit: '=limit'
        },
        templateUrl: 'views/templates/pickers/units-picker.tpl.html',
        link: function(scope, elem, attrs) {
            if (scope.limit === undefined) {
                scope.limit = 10;
            }
            input = elem.find('input');


            scope.visible = true;


            events = scope.events;

            scope.suggestions = [];
            scope.selectedIndex = -1;


            scope.search = function() {
                if (scope.searchText === '') {
                    scope.suggestions = [];
                } else {
                    scope.visible = true;
                    UnitService.getUnitsAndUnitGroups({
                        "filter": scope.searchText,
                        "limit": scope.limit
                    }).then(function(unitsAndUnitGroups) {
                        scope.suggestions = unitsAndUnitGroups;
                    });
                }
                scope.selectedIndex = -1;

            };

            scope.addToUnitLists = function(index) {
                input[0].focus();	

                if (scope.suggestions[scope.selectedIndex].groupName !== undefined) {
                    scope.unitGroupsList.push(scope.suggestions[scope.selectedIndex]);
                } else if (scope.suggestions[scope.selectedIndex].refid !== undefined) {
                    scope.unitsList.push(scope.suggestions[scope.selectedIndex]);
                }

                scope.searchText = '';
                scope.suggestions = [];

            };

            scope.checkKeyDown = function(event) {
                if (event.keyCode === 40) { //down
                    event.preventDefault();
                    if (scope.selectedIndex + 1 !== scope.suggestions.length) {
                        scope.selectedIndex++;
                    }
                } else if (event.keyCode === 38) { //up
                    event.preventDefault();
                    if (scope.selectedIndex - 1 !== -1) {
                        scope.selectedIndex--;
                    }
                } else if (event.keyCode === 13 || event.keyCode === 9) { //enter or tab
                    scope.addToUnitLists(scope.selectedIndex);
                    event.preventDefault();
                }
            };

            scope.$watch('selectedIndex', function(val) {
                if (val !== -1) {
                    //if group
                    if (scope.suggestions[scope.selectedIndex].groupName !== undefined) {
                        scope.searchText = scope.suggestions[scope.selectedIndex].groupName;
                    } else if (scope.suggestions[scope.selectedIndex].refid !== undefined) {
                        scope.searchText = scope.suggestions[scope.selectedIndex].refid;
                    }
                }
            });



            scope.hideResults = function() {
                $timeout(function() {
                    var activeElement = $document.prop('activeElement'),
                        lostFocusToBrowserWindow = activeElement !== input[0],
                        lostFocusToChildElement = elem[0].contains(activeElement);

                    //lost focus and not a suggestion click
                    if (lostFocusToBrowserWindow && !lostFocusToChildElement) {
                        scope.visible = false;
                        scope.suggestions = [];
                        scope.searchText = '';
                    }
                });

            };
        }
    };
}]);



app.directive('enumsPicker', ['$timeout', '$document', 'EnumService', function($timeout, $document, EnumService) {
    return {
        restrict: 'A',
        scope: {
            enumGroupsList: '=enumgroups',
            enumsList: '=enums',
            limit: '=limit'
        },
        templateUrl: 'views/templates/pickers/enums-picker.tpl.html',
        link: function(scope, elem, attrs) {
            if (scope.limit === undefined) {
                scope.limit = 10;
            }
            input = elem.find('input');


            scope.visible = true;


            events = scope.events;

            scope.suggestions = [];
            scope.selectedIndex = -1;


            scope.search = function() {
                if (scope.searchText === '') {
                    scope.suggestions = [];
                } else {
                    scope.visible = true;
                    EnumService.getEnumsAndEnumGroups({
                        "filter": scope.searchText,
                        "limit": scope.limit
                    }).then(function(enumsAndEnumGroups) {
                        scope.suggestions = enumsAndEnumGroups;
                    });
                }
                scope.selectedIndex = -1;

            };

            scope.addToEnumLists = function(index) {
                input[0].focus();	

                if (scope.suggestions[scope.selectedIndex].groupName !== undefined) {
                    scope.enumGroupsList.push(scope.suggestions[scope.selectedIndex]);
                } else if (scope.suggestions[scope.selectedIndex].refid !== undefined) {
                    scope.enumsList.push(scope.suggestions[scope.selectedIndex]);
                }

                scope.searchText = '';
                scope.suggestions = [];

            };

            scope.checkKeyDown = function(event) {
                if (event.keyCode === 40) { //down
                    event.preventDefault();
                    if (scope.selectedIndex + 1 !== scope.suggestions.length) {
                        scope.selectedIndex++;
                    }
                } else if (event.keyCode === 38) { //up
                    event.preventDefault();
                    if (scope.selectedIndex - 1 !== -1) {
                        scope.selectedIndex--;
                    }
                } else if (event.keyCode === 13 || event.keyCode === 9) { //enter or tab
                    scope.addToEnumLists(scope.selectedIndex);
                    event.preventDefault();
                }
            };

            scope.$watch('selectedIndex', function(val) {
                if (val !== -1) {
                    //if group
                    if (scope.suggestions[scope.selectedIndex].groupName !== undefined) {
                        scope.searchText = scope.suggestions[scope.selectedIndex].groupName;
                    } else if (scope.suggestions[scope.selectedIndex].refid !== undefined) {
                        scope.searchText = scope.suggestions[scope.selectedIndex].refid;
                    }
                }
            });



            scope.hideResults = function() {
                $timeout(function() {
                    var activeElement = $document.prop('activeElement'),
                        lostFocusToBrowserWindow = activeElement !== input[0],
                        lostFocusToChildElement = elem[0].contains(activeElement);

                    //lost focus and not a suggestion click
                    if (lostFocusToBrowserWindow && !lostFocusToChildElement) {
                        scope.visible = false;
                        scope.suggestions = [];
                        scope.searchText = '';
                    }
                });

            };
        }
    };
}]);

