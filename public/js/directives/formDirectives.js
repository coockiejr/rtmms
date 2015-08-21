var app = angular.module('rtmms');

app.directive('ngMatch', ['$parse', function($parse) {
    return {
        restrict: 'A',
        require: "ngModel",

        link: function(scope, element, attrs, ctrl) {
            var directiveId = 'ngMatch';
            if (!ctrl) return;
            if (!attrs[directiveId]) return;

            var firstPassword = $parse(attrs[directiveId]);

            var validator = function(value) {
                var temp = firstPassword(scope),
                    v = value === temp;
                ctrl.$setValidity('match', v);

                return value;
            };

            ctrl.$parsers.unshift(validator);
            ctrl.$formatters.push(validator);
            attrs.$observe(directiveId, function() {
                validator(ctrl.$viewValue);
            });
        }
    };
}]);


app.directive('onlyDigitsForMinSec', function() {
    return {
        require: 'ngModel',
        restrict: 'A',
        link: function(scope, element, attr, ctrl) {
            function inputValue(val) {
                if (val) {
                    var digits = val.replace(/[^0-9]/g, '');
                    if (digits < 0) digits = '0';
                    if (digits > 59) digits = '59';
                    if (digits !== val) {
                        ctrl.$setViewValue(digits);
                        ctrl.$render();
                    }
                    return parseInt(digits, 10);
                }
                return undefined;
            }
            ctrl.$parsers.push(inputValue);
        }
    };
});

app.directive('onlyDigits', function() {
    return {
        require: 'ngModel',
        restrict: 'A',
        link: function(scope, element, attr, ctrl) {
            function inputValue(val) {
                if (val) {
                    var digits = val.replace(/[^0-9]/g, '');
                    if (digits !== val) {
                        ctrl.$setViewValue(digits);
                        ctrl.$render();
                    }
                    return parseInt(digits, 10);
                }
                return undefined;
            }
            ctrl.$parsers.push(inputValue);
        }
    };
});




app.directive("memberselector", function() {
    return {
        restrict: "E",
        transclude: true,
        scope: {
            datamembers: "=",
            members: "=",
            index: "@"
        },
        templateUrl: "views/templates/pagination/memberDropdown.html",
        link: function(scope, element) {
            scope.deleteMemberSelector = function(datamembers, index) {
                datamembers.splice(index, 1);
                element.remove();
            };
        }
    };
});

app.directive('ngConfirmClick', [
    function() {
        return {
            link: function(scope, element, attr) {
                var msg = attr.ngConfirmClick || "Are you sure?";
                var clickAction = attr.confirmedClick;
                element.bind('click', function(event) {
                    if (window.confirm(msg)) {
                        scope.$eval(clickAction);
                    }
                });
            }
        };
    }
]);
