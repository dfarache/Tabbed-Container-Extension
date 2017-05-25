define([
    'jquery',
    'angular',
    'qlik',
    'text!./TabbedContainer.css',
    'text!./template.html',
    './properties/definition',
    './constants/colors',
    './services/tabService',
    './directives/initObjects',
    './directives/onTabsDone'
],

    function($, a, qlik, cssStyles, template, definition, colors) {
        var hexToRgb = function(hex) {
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        }
        var timeout;

        $("<style>").html(cssStyles).appendTo("head");

        return {
            initialProperties: {
                version: 1.0
            },
            definition: definition,
            support: {
                snapshot: true,
                export: false,
                exportData: false
            },
            template: template,
            priority: 0,
            paint: function($element, layout) {
                var that = this;
                // what's the width?
                var container_width = $element.find(".tab_container").width();
                var tabs_width = 0;

                $element.find(".tabs").children().each(function(index) {
                    tabs_width += $(this).outerWidth();
                });
                tabs_width += 25;

                $element.parent().data("containerwidth", $element.find(".tab_container").width());

                setTimeout(function() {
                    if( container_width < tabs_width && !$element.parent().hasClass("stacked")) {
                        // ensure it's stacked:
                        $element.parent().addClass("stacked");
                            var outerHeight = 0;
                            outerHeight = $element.find("h3.tab_drawer_heading:first").outerHeight() * $element.find("h3.tab_drawer_heading").length;
                            outerHeight += 40;  // padding for the item

                            $element.find("div.tab_content:visible").height($element.find(".tab_container").height() - outerHeight);
                            // going into 'stacked mode':
                            //$element.find(".tab_container").height($element.find(".tab_container").height() + $element.find(".tab_container").find("li:first").height());

                    } else {
                        $element.parent().removeClass("stacked");
                        $element.find("div.tab_content:visible").css("height", "")
                    }
                },10)

                // Paint the border and the background of the object container
                var tileBackground = hexToRgb(colors.palette[layout.backgroundColor]);
                var backgroundColor = (layout.backgroundColorCode !== undefined && layout.backgroundColorCode.length > 0) ?
                    layout.backgroundColorCode :
                    'rgba(' + tileBackground.r + ','+ tileBackground.g + ',' + tileBackground.b + ', 0.2)';

                $element.find('.tab_container').css('border-color', colors.palette[layout.borderColor]);
                $element.find('.tab_content').css('background-color', backgroundColor);


                return qlik.Promise.resolve();
            },
            resize: function($element, layout) {

                this.paint($element, layout);

            },
            controller: ['$scope', '$timeout', 'tabService',
                function($scope, $timeout, tabService) {
                    $scope.layout.colors = colors;
                    $scope.activeTab = 0;

                    $scope.isTabActive = function(tab, tabItems, index) {
                        return tab.id === tabItems[index].id;
                    }

                    $scope.getTabStyles = function(tab, tabItems, index) {
                        var buttonBackground = hexToRgb(colors.palette[$scope.layout.buttonColor])

                        return $scope.isTabActive(tab, tabItems, index) ?
                            {
                                'background-color': 'rgba(' + buttonBackground.r + ','+ buttonBackground.g + ',' + buttonBackground.b + ', 0.2)',
                                'border-color': colors.palette[$scope.layout.buttonColor]
                            } :
                            {
                                'background-color': colors.inactive.background,
                                'border-color': colors.inactive.border
                            }
                    }

                    $scope.localId = $scope.$parent.options.id;
                    $scope.tabItems = tabService.getTabInfo($scope);

                    /* TODO: react dynamically to object additions/removals
                    $scope.$watchCollection('layout', function(newValue, oldValue){
                        $scope.localId = $scope.$parent.options.id;
                        $scope.tabItems = tabService.getTabInfo($scope);
                    });*/
                }
            ]
        };

    }
);
