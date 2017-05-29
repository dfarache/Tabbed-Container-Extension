/** showFirstObject
 *
 * Directive that is called in the ng-repeat of the object container
 * on initialization. It
 **/
define(["angular", "qvangular", "qlik"], function(angular, qva, qlik) {
    "use strict";

    qva.directive("showFirstObject", ['$timeout',
        function($timeout) {
            return {
                scope: {
                    localid: '@',
                    tab: '='
                },
                priority: 0,
                restrict: 'A',
                link: function($scope) {
                    if(!$scope.$parent.$first) { return; }

                    $timeout(function(){
                        qlik.currApp().getObject(
                            $('#' + $scope.localid + '_' + $scope.tab.id),
                            $scope.tab.objectid
                        )
                    }, 0)
                }
            }
        }
    ])
})
