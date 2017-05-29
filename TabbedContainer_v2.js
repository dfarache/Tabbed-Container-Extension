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
    './directives/stackedContainer',
    './directives/showFirstObject'
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
                    $scope.currentObject;

                    $scope.isTabActive = function(tab, activeTab) {
                        return tab.id === activeTab.id;
                    }

                    $scope.getTabStyles = function(tab, activeTab) {
                        var buttonBackground = colorsService.hexToRgb(colors.palette[$scope.layout.buttonColor])

                        return $scope.isTabActive(tab, activeTab) ?
                            {
                                'background-color': colorsService.toString(buttonBackground, 0.2),
                                'border-color': colorsService.toString(buttonBackground)
                            } :
                            {
                                'background-color': colors.inactive.background,
                                'border-color': colors.inactive.border
                            }
                    }

                    $scope.onTabClick = function(index) {
                        $scope.activeTab = $scope.tabItems[index];

                        qlik.currApp().getObject(
                            $('#' + $scope.localId + '_' + $scope.activeTab.id),
                            $scope.activeTab.objectid
                        )
                    }

                    $scope.localId = $scope.$parent.options.id;
                    $scope.tabItems = tabService.getTabInfo($scope);
                    $scope.activeTab = $scope.tabItems[0];

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
