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
    './directives/stackedContainer'
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
                /* the background of the container can be determined
                 * by the color picker or the text input. The latter has priority. */
                if(layout.backgroundColorCode.length > 0) {
                    var tileBackground = layout.backgroundColorCode;
                } else {
                    var tileBackgroundRgb = colors.palette[layout.backgroundColor]);
                    var tileBackground = colorsService.toString(tileBackgroundRgb, 0.2);
                }

                // Paint the border and the background of the object container
                var tileBorder = colorsService.hexToRgb(colors.palette[layout.borderColor]);
                $element.find('.tab_container').css('border-color', colorsService.toString(tileBorder));
                $element.find('.tab_content').css('background-color', tileBackground);

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


                    /** Reinitialize the tabItems object if the layout changes,
                     * which happens when the user gives some input.
                     *
                     * Then, check for the following scenarios:
                     *     1. The first tab is added -> render it inmediately
                     *     2. The active tab was removed -> take user to tab 0
                     *     3. Otherwise, reload the current object */
                    $scope.$watch('layout', function(newValue){
                        var prevNumberTabs = $scope.tabItems.length;
                        $scope.tabItems = tabService.getTabInfo($scope);

                        if(prevNumberTabs === 0 && $scope.tabItems.length > 0){
                            $scope.onTabClick(0);
                        } else if($scope.tabItems.length > 0){
                            // if active tab is -1, then it was removed
                            var activeTabIndex = -1;
                            for(var i=0; i<$scope.tabItems.length; i++){
                                if($scope.tabItems[i].index === $scope.activeTab.index) {
                                    activeTabIndex = i;
                                    break;
                                }
                            }

                            $timeout(function(){
                                (activeTabIndex === -1) ? $scope.onTabClick(0)
                                    : $scope.onTabClick(activeTabIndex);
                            },200)
                        }
                    }, true);
                }
            ]
        };

    }
);
