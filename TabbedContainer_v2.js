define([
    'jquery',
    'angular',
    'qlik',
    'text!./TabbedContainer.css',
    'text!./template.html',
    './properties/definition',
    './services/tabService',
    './directives/initObjects', './directives/onTabsDone'],

    function($, a, qlik, cssStyles, template, definition, ts) {
        var inactiveColors = { background: '#f2f2f2', border: '#e6e6e6' };
        var palette = ["#b0afae", "#7b7a78", "#545352", "#4477aa", "#7db8da",
            "#b6d7ea", "#46c646", "#f93f17", "#ffcf02", "#276e27",
            "#ffffff", "#000000"];

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

                setTimeout(function(){
                    if(timeout !== undefined){ clearTimeout(timeout); }

                    var buttonBorder = hexToRgb(palette[layout.buttonColor]);
                    var tileBackground = hexToRgb(palette[layout.backgroundColor]);

                    var buttonBackground = 'rgba(' + buttonBorder.r + ','+ buttonBorder.g + ',' + buttonBorder.b + ', 0.2)';
                    var backgroundColor = (layout.backgroundColorCode !== undefined && layout.backgroundColorCode.length > 0) ?
                        layout.backgroundColorCode :
                        'rgba(' + tileBackground.r + ','+ tileBackground.g + ',' + tileBackground.b + ', 0.2)';

                    $element.find('.tab_container').css('border-color', palette[layout.borderColor]);
                    $element.find('.tab_content').css('background-color', backgroundColor);

                    $element.find('.buttonTab.active').css('border-color', palette[layout.buttonColor]);
                    $element.find('.buttonTab.active').css('background-color', buttonBackground);

                    $element.find('.buttonTab').click(function(){
                        var activeTab = $(this).attr("rel");
                        var qvid = $("#" + activeTab).data("qvid");

                        timeout = setTimeout(function(){
                            $element.find('.buttonTab').css('background-color', inactiveColors.background);
                            $element.find('.buttonTab').css('border-color', inactiveColors.border);

                            $element.find('.buttonTab.active').css('border-color', palette[layout.buttonColor]);
                            $element.find('.buttonTab.active').css('background-color', buttonBackground);

                        }, 10)
                    });
                }, 10);

                return qlik.Promise.resolve();
            },
            resize: function($element, layout) {

                this.paint($element, layout);

            },
            controller: ['$scope', '$timeout', 'tabService',
                function($scope, $timeout, tabService) {
                    $scope.localId = $scope.$parent.options.id;
                    $scope.tabItems = tabService.getTabInfo($scope);
                }
            ]
        };

    }
);
