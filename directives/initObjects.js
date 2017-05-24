define(["jquery", "angular", "qvangular", "qlik"], function($, a, qva, qlik) {
    "use strict";

    qva.directive("initObjects", ["$timeout",
        function($timeout) {
            return {
                scope: 0,
                priority: 0,
                restrict: 'A',
                link: function($scope, element, attrs) {
                    var hasInit = false;
                    $scope.$on('tabs_done', function(tabElement) {
                        if(hasInit){ return; }
                        hasInit = true;

                        $timeout(function() {
                            /////////////////////////////////////////////////////

                            var tabs = element.prev();
                            var tab_container = element;

                            var tabsWidth = 0;
                            tabs.find("li").each(function(index) {
                                tabsWidth += $(this).outerWidth();
                            });

                            // add on an amount of width so that items toggle appropriately:
                            tabsWidth += 25;

                            // let's add the tabs' width, for later use:
                            tabs.parent().parent().data("tabswidth", tabsWidth);
                            tabs.parent().parent().data("containerwidth", tab_container.width());

                            if (tab_container.width() < tabsWidth) {

                                tabs.parent().parent().addClass("stacked");

                                // setTimeout(function() {

                                var outerHeight = 0;
                                outerHeight = tab_container.find("h3.tab_drawer_heading:first").outerHeight() * tab_container.find("h3.tab_drawer_heading").length;
                                outerHeight += 40; // padding for the item


                                // work out the container height:
                                var containerHeight = tab_container.height() - outerHeight;
                                tab_container.find("div.tab_content:eq(0)").height(containerHeight);

                                //}, 250);


                                // increase the height of the container and the content by an amount :)

                                //tab_container.height(tab_container.height() + tabs.find("li:first").height());


                            } else {

                            }


                            /////////////////////////////////////////////////////
                        }, 1);



                        $timeout(function() {

                            var tabs = element.prev();
                            var tab_container = element;

                            // tabbed content
                            tab_container.find(".tab_content").hide();
                            tab_container.find(".tab_content:first").show();

                            /* if in tab mode */
                            tabs.find("li").click(function() {

                                tab_container.find(".tab_content").hide();
                                var activeTab = $(this).attr("rel");
                                $("#" + activeTab).fadeIn();

                                tabs.find("li").removeClass("active");
                                $(this).addClass("active");

                                tab_container.find(".tab_drawer_heading").removeClass("d_active");
                                tab_container.find(".tab_drawer_heading[rel^='" + activeTab + "']").addClass("d_active");

                                var qvid = $("#" + activeTab).data("qvid");

                                qlik.currApp().getObject($("#" + activeTab), qvid);
                            });

                            /* if in drawer mode */
                            tabs.parent().find(".tab_drawer_heading").click(function() {
                            //$(".tab_drawer_heading").click(function() {

                                tab_container.find(".tab_content").hide();
                                var d_activeTab = $(this).attr("rel");
                                //$("#"+d_activeTab).fadeIn();

                                $("#" + d_activeTab).show();

                                tab_container.find(".tab_drawer_heading").removeClass("d_active");
                                $(this).addClass("d_active");

                                tabs.find("li").removeClass("active");
                                tabs.find("li[rel^='" + d_activeTab + "']").addClass("active");

                                // ensure that the height is set correctly:
                                setTimeout(function() {

                                    var outerHeight = 0;
                                    outerHeight = tab_container.children("h3.tab_drawer_heading:first").outerHeight() * tab_container.children("h3.tab_drawer_heading").length;
                                    outerHeight += 40; // padding for the item
                                    
                                    tab_container.find("div.tab_content:visible").height(tab_container.height() - outerHeight);

                                    var qvid = $("#" + d_activeTab).data("qvid");
                                    qlik.currApp().getObject($("#" + d_activeTab), qvid);

                                }.bind(this), 10);
                            });


                            /* Extra class "tab_last"
                               to add border to right side
                               of last tab */
                            $('ul.tabs li').last().addClass("tab_last");

                            // a.forEach(element.children(), function(e) {
                            //                                 if (void 0 !== $(e).data("qvid")) {
                            //                                     qlik.currApp().getObject(e, $(e).data("qvid"));
                            //                                 }
                            //                             });

                            //   console.log(tab_container.find("div:first"));
                            //console.log(tab_container.find("div:first").data("qvid"));

                            setTimeout(function() {
                                var qvid = tab_container.find("div:first").data("qvid");
                                qlik.currApp().getObject(tab_container.find("div:first"), qvid);
                            }, 500);

                        }, 500);
                    });
                }
            }
        }
    ])
});
