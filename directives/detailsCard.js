define(['qvangular', 'qlik'], function(qva, qlik){

    qva.directive('detailsCard', ['$timeout', 'qlikService', function($timeout, qlikService) {
        return {
            restrict: 'E',
            template: '<div ng-show="displayCard" ng-click="closeCard($event)" class="card-container"><div class="main-step-container card-custom-default">' +
                '<div class="setup-animation q-outer-card-box"><div class="q-include-card">' +
                '<div class="q-card-header-container ng-scope"><div class="q-card-header">' +
                '<span>Details</span></div><div><button ng-click="closeCard($event)" class="lui-fade-button close-button" title="close">' +
                '<span class="lui-button__icon lui-icon lui-icon--close"></span></button>' +
                '</div></div></div></div></div></div>',
            replace: true,
            scope: {
                displayCard: '=',
                tab: '='
            },
            link: function(scope, elem) {
                var container = $(elem);
                var card = $(elem).find('.q-outer-card-box')[0];

                $(elem).appendTo('.qv-panel-stage');

                scope.closeCard = function(ev){
                    ev.stopPropagation();
                    $(card).removeClass('start-card-animation');
                    $(card).addClass('finish-card-animation');

                    $timeout(function(){
                        scope.displayCard = false;
                    }, 200);
                }

                scope.$watch('displayCard', function(displayCard){
                    if(!displayCard) { return; }
                    $timeout(function(){
                        $(card).addClass('start-card-animation');
                        $(card).removeClass('finish-card-animation');
                    }, 100)
                });
            }
        }
    }])

    qva.directive('detailsCardButton', function(){
        return {
            restrict: 'E',
            template: '<div class="detailsButtonContainer">' +
                '<button ng-click="toggleDisplayCard()"><span class="lui-icon lui-icon--info"></span></button></div>',
            scope: {
                toggleDisplayCard: '&'
            }
        }
    });
})
