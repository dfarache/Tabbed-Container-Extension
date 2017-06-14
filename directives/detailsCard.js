define([
  'qvangular',
  'qlik',
  'text!./templates/detailsCard.html',
  'text!./templates/detailsCardButton.html'
], function(qva, qlik, ngTemplateCard, ngTemplateButton){

    var app = qlik.currApp();

    qva.directive('detailsCard', ['$timeout', 'qlikService', function($timeout, qlikService) {
        return {
            restrict: 'E',
            template: ngTemplateCard,
            replace: true,
            scope: {
                displayCard: '=',
                tab: '='
            },
            link: function(scope, elem) {
                var container = $(elem);
                var card = $(elem).find('.q-outer-card-box')[0];

                $(elem).appendTo('.qv-panel-stage');

                scope.details;
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

                // if the active tab changes, get the object model again
                scope.$watch('tab', function(tab){
                    qlikService.getObjectMetadata(app, tab.objectid).then(function(metadata){
                        scope.details = metadata;
                    });
                });
            }
        }
    }])

    qva.directive('detailsCardButton', ['qlikService', function(qlikService){
        return {
            restrict: 'E',
            template: ngTemplateButton,
            scope: {
                toggleDisplayCard: '&',
                tab: '='
            },
            link: function(scope) {
                scope.hideButton = true;

                qlikService.getObjectMetadata(app, scope.tab.objectid).then(function(metadata){
                    scope.hideButton = (metadata != undefined);
                });
            }
        }
    }]);
})
