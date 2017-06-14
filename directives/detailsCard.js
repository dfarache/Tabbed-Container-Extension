define(['qvangular', 'qlik', 'text!./templates/detailsCard.html'], function(qva, qlik, ngTemplate){

    qva.directive('detailsCard', ['$timeout', 'qlikService', function($timeout, qlikService) {
        return {
            restrict: 'E',
            template: ngTemplate,
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
