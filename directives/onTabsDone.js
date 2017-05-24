define(["jquery", "qvangular", "qlik"], function($, qva, qlik) {
    "use strict";
    qva.directive("onTabsDone", function() {
        return {
            scope: 0,
            priority: 0,
            restrict: 'A',
            link: function($scope, element, attributes) {

                if ($scope.$last) {
                    $scope.$emit(attributes["onTabsDone"] || "tabs_done", element);
                }

            }
        }
    })
});
