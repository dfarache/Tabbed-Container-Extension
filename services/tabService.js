define(["qvangular"], function(qva) {
    "use strict";

    qva.service("tabService", ["$q",
        function(q) {

            return {

                getTabInfo: function($scope) {
                    var i = 0;
                    var tabItems = [];
                    var objectid, tab;

                    for(var key in $scope.layout.props) {
                        tab = $scope.layout.props[key];

                        if(tab.title.length > 0 && (tab.masterItem.length > 0 || tab.objectid.length > 0)) {
                            objectid = (tab.objectid.length > 0) ? tab.objectid : tab.masterItem;

                            tabItems.push({
                                id: i + objectid,
                                objectid: objectid,
                                title: tab.title,
                                index: i
                            })
                        }
                        i++;
                    }

                    return tabItems;
                }
            }
        }
    ])
});
