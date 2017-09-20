define(["jquery", "qvangular", "qlik"], function($, qva, qlik) {

    qva.directive("stackedContainer", function() {
        return {
            scope: 0,
            priority: 0,
            restrict: 'A',
            link: function($scope, $element) {
                // execute if the width of the container changes
                $scope.$watch(function(){
                    return $element.find(".tab_container").width();
                }, function(newValue){                    
                    stackContainer($element);
                })
            }
        }
    })


    /** stackContainer()
    * If the space needed by the tabs is bigger than the container's
    * then go into stacked mode.
    * @param {Object} $element
    */
    function stackContainer($element){
        var container_width = $element.find(".tab_container").width();
        var tabs_width = 25;

        $element.parent().removeClass("stacked");
        $element.find(".tabs").children().each(function(index) {
            tabs_width += $(this).outerWidth();
        });

        if(container_width < tabs_width && !$element.parent().hasClass("stacked")) {
            $element.parent().addClass("stacked");
            var outerHeight = 0;
            outerHeight = $element.find("h3.tab_drawer_heading:first").outerHeight() * $element.find("h3.tab_drawer_heading").length;
            outerHeight += 40;  // padding for the item

            $element.find("div.tab_content:visible").height($element.find(".tab_container").height() - outerHeight);
            $element.find("div.buttonsContainer").each(function(i) {
                $(this).css("top", (20 + (30 * i)) + "px");
            });
        } else {
            $element.find("div.tab_content:visible").css('height', 'inherit');
            $element.find("div.buttonsContainer").css('top', '20px');
        }
    }
});
