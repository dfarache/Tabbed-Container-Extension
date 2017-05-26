define([
    'jquery',
    'angular',
    'qlik',
    'text!./TabbedContainer.css',
    'text!./template.html',
    './properties/definition',
    './constants/colors',
    './services/tabService',
    './services/colorsService',
    './directives/initObjects',
    './directives/stackedContainer',
    './directives/onTabsDone'
],

    function($, a, qlik, cssStyles, template, definition, colors) {
        var colorsService;

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
                // Paint the border and the background of the object container
                var tileBorder = colorsService.hexToRgb(colors.palette[layout.borderColor]);
                var tileBackground = colorsService.hexToRgb(colors.palette[layout.backgroundColor]);

                $element.find('.tab_container').css('border-color', colorsService.toString(tileBorder));;
                $element.find('.tab_content').css('background-color', colorsService.toString(tileBackground, 0.2));

                return qlik.Promise.resolve();
            },
            resize: function($element, layout) {

                this.paint($element, layout);

            },
            controller: ['$scope', '$timeout', 'tabService', 'colorsService',
                function($scope, $timeout, tabService, cService) {
                    colorsService = cService;
                    $scope.layout.colors = colors;
                    $scope.activeTab = 0;

                    $scope.isTabActive = function(tab, tabItems, index) {
                        return tab.id === tabItems[index].id;
                    }

                    $scope.getTabStyles = function(tab, tabItems, index) {
                        var buttonBackground = colorsService.hexToRgb(colors.palette[$scope.layout.buttonColor])

                        return $scope.isTabActive(tab, tabItems, index) ?
                            {
                                'background-color': colorsService.toString(buttonBackground, 0.2),
                                'border-color': colorsService.toString(buttonBackground)
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
