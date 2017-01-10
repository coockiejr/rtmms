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
                exist = false;
                gExist = false;
                if (scope.unitGroupsList === undefined) {
                    scope.unitGroupsList = [];
                }
                if (scope.unitsList === undefined) {
                    scope.unitsList = [];
                }
                if (scope.suggestions[scope.selectedIndex].groupName !== undefined) {
                    for (i = 0; i < scope.unitGroupsList.length; i++) {
                        if (scope.unitGroupsList[i]._id === scope.suggestions[scope.selectedIndex]._id) {
                            exist = true;
                        }
                    }
                    if (!exist) {
                        scope.unitGroupsList.push(scope.suggestions[scope.selectedIndex]);

                    }
                } else if (scope.suggestions[scope.selectedIndex].term.refid !== undefined) {
                    for (i = 0; i < scope.unitsList.length; i++) {
                        if (scope.unitsList[i]._id === scope.suggestions[scope.selectedIndex]._id) {
                            gExist = true;
                        }
                    }
                    if (!gExist) {
                        scope.unitsList.push(scope.suggestions[scope.selectedIndex]);

                    }

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


app.directive('ucumsPicker', ['$timeout', '$document', 'UnitService', function($timeout, $document, UnitService) {
    return {
        restrict: 'A',
        scope: {
            ucumsList: '=ucums',
            limit: '=limit'
        },
        templateUrl: 'views/templates/pickers/ucums-picker.tpl.html',
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
                    UnitService.getUcums({
                        "filter": scope.searchText,
                        "limit": scope.limit
                    }).then(function(ucums) {
                        scope.suggestions = ucums;
                    });
                }
                scope.selectedIndex = -1;

            };



            scope.addToUcumLists = function(index) {
                input[0].focus();
                exist = false;
                if (scope.ucumsList === undefined) {
                    scope.ucumsList = [];
                }
                if (scope.suggestions[scope.selectedIndex] !== undefined) {
                    for (i = 0; i < scope.ucumsList.length; i++) {
                        if (scope.ucumsList[i]._id === scope.suggestions[scope.selectedIndex]._id) {
                            exist = true;
                        }
                    }
                    if (!exist) {
                        scope.ucumsList.push(scope.suggestions[scope.selectedIndex]);

                    }

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
                    scope.addToUcumLists(scope.selectedIndex);
                    event.preventDefault();
                }
            };

            scope.$watch('selectedIndex', function(val) {
                if (val !== -1) {

                    if (scope.suggestions[scope.selectedIndex] !== undefined) {
                        for (i = 0; i < scope.suggestions[scope.selectedIndex].length; i++) {

                            scope.searchText = scope.suggestions[scope.selectedIndex].value;
                        }
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
                if (scope.enumGroupsList === undefined) {
                    scope.enumGroupsList = [];
                }
                if (scope.enumsList === undefined) {
                    scope.enumsList = [];
                }

                if (scope.suggestions[scope.selectedIndex].groupName !== undefined) {
                    scope.enumGroupsList.push(scope.suggestions[scope.selectedIndex]);
                } else if (scope.suggestions[scope.selectedIndex].term.refid !== undefined) {
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




app.directive('externalSitesPicker', ['$timeout', '$document', 'EnumService', function($timeout, $document, EnumService) {
    return {
        restrict: 'A',
        scope: {
            enumGroupsList: '=enumgroups',
            enumsList: '=enums',
            limit: '=limit'
        },
        templateUrl: 'views/templates/pickers/externalSite-picker.tpl.html',
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
                if (scope.enumGroupsList === undefined) {
                    scope.enumGroupsList = [];
                }
                if (scope.enumsList === undefined) {
                    scope.enumsList = [];
                }

                if (scope.suggestions[scope.selectedIndex].groupName !== undefined) {
                    scope.enumGroupsList.push(scope.suggestions[scope.selectedIndex]);
                } else if (scope.suggestions[scope.selectedIndex].term.refid !== undefined) {
                    scope.enumsList.push(scope.suggestions[scope.selectedIndex]);
                }
                console.log(scope.enumsList);
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


app.directive('rosettaRefidPicker', ['$timeout', '$document', 'RosettaService', function($timeout, $document, RosettaService) {
    return {
        restrict: 'A',
        scope: {
            refid: '=refids',
            limit: '=limit'
        },
        templateUrl: 'views/templates/pickers/refid-picker.tpl.html',
        link: function(scope, elem, attrs) {
            if (scope.limit === undefined) {
                scope.limit = 10;
            }
            input = elem.find('input');


            scope.visible = true;

            events = scope.events;

            scope.suggestions = [];
            scope.selectedIndex = -1;
            scope.searchText = '';


            scope.search = function() {
                if (scope.searchText === '') {
                    scope.suggestions = [];
                    scope.refid = [];
                } else {
                    scope.visible = true;
                    console.log(scope.searchText);

                    RosettaService.getRosettaRefids({
                        "filter": scope.searchText,
                        "limit": scope.limit
                    }).then(function(refids) {
                        scope.suggestions = refids;
                    });
                }
                scope.selectedIndex = -1;

            };

            scope.addToRefidLists = function(index) {
                input[0].focus();



                if (scope.suggestions[scope.selectedIndex] !== undefined) {
                    scope.refid = scope.suggestions[scope.selectedIndex].term;
                }
                //   console.log(scope.refidList);

                scope.searchText = scope.suggestions[scope.selectedIndex].term.refid;
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
                    scope.addToRefidLists(scope.selectedIndex);
                    event.preventDefault();
                }
            };

            scope.$watch('selectedIndex', function(val) {
                if (val !== -1) {
                    //if group
                    if (scope.suggestions[scope.selectedIndex] !== undefined) {
                        scope.searchText = scope.suggestions[scope.selectedIndex].term.refid;
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
                        //  
                    }
                });

            };

        }
    };
}]);

app.directive('unitRefidPicker', ['$timeout', '$document', 'UnitService', function($timeout, $document, UnitService) {
    return {
        restrict: 'A',
        scope: {
            refid: '=refids',
            limit: '=limit'
        },
        templateUrl: 'views/templates/pickers/refid-picker.tpl.html',
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
                    scope.refid = [];
                } else {
                    scope.visible = true;
                    console.log(scope.searchText);

                    UnitService.getUnitRefids({
                        "filter": scope.searchText,
                        "limit": scope.limit
                    }).then(function(refids) {
                        scope.suggestions = refids;
                    });
                }
                scope.selectedIndex = -1;

            };

            scope.addToRefidLists = function(index) {
                input[0].focus();



                if (scope.suggestions[scope.selectedIndex] !== undefined) {
                    scope.refid = scope.suggestions[scope.selectedIndex].term;
                }
                //   console.log(scope.refidList);

                scope.searchText = scope.suggestions[scope.selectedIndex].term.refid;
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
                    scope.addToRefidLists(scope.selectedIndex);
                    event.preventDefault();
                }
            };

            scope.$watch('selectedIndex', function(val) {
                if (val !== -1) {
                    //if group
                    if (scope.suggestions[scope.selectedIndex] !== undefined) {
                        scope.searchText = scope.suggestions[scope.selectedIndex].term.refid;
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
                        //  scope.searchText = '';
                    }
                });

            };
        }
    };
}]);

app.directive('enumRefidPicker', ['$timeout', '$document', 'EnumService', function($timeout, $document, EnumService) {
    return {
        restrict: 'A',
        scope: {
            refid: '=refids',
            limit: '=limit'
        },
        templateUrl: 'views/templates/pickers/refid-picker.tpl.html',
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
                    scope.refid = [];
                } else {
                    scope.visible = true;
                    console.log(scope.searchText);

                    EnumService.getEnumRefids({
                        "filter": scope.searchText,
                        "limit": scope.limit
                    }).then(function(refids) {
                        scope.suggestions = refids;
                    });
                }
                scope.selectedIndex = -1;

            };

            scope.addToRefidLists = function(index) {
                input[0].focus();



                if (scope.suggestions[scope.selectedIndex] !== undefined) {
                    scope.refid = scope.suggestions[scope.selectedIndex].term;
                }
                //   console.log(scope.refidList);

                scope.searchText = scope.suggestions[scope.selectedIndex].term.refid;
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
                    scope.addToRefidLists(scope.selectedIndex);
                    event.preventDefault();
                }
            };

            scope.$watch('selectedIndex', function(val) {
                if (val !== -1) {
                    //if group
                    if (scope.suggestions[scope.selectedIndex] !== undefined) {
                        scope.searchText = scope.suggestions[scope.selectedIndex].term.refid;
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
                        //  scope.searchText = '';
                    }
                });

            };
        }
    };
}]);