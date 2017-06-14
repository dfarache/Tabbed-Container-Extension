define(['qvangular', 'qlik'], function(qva, qlik){

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
