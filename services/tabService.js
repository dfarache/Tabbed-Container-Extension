define(["qvangular"], function(qva) {
    "use strict";

    qva.service("tabService", function() {

        return {

            getTabInfo: function($scope) {
                var tabItems = [];
                var maxTabItems = 5;
                var objectid, tab;

                for(var i=1; i<=maxTabItems; i++) {
                    tab = $scope.layout.props['tab' + i];

                    if(tab.title.length > 0 && (tab.masterItem.length > 0 || tab.objectid.length > 0)) {
                        objectid = (tab.objectid.length > 0) ? tab.objectid : tab.masterItem;

                        tabItems.push({
                            id: i + objectid,
                            objectid: objectid,
                            title: tab.title,
                            index: i
                        })
                    }
                }

                return tabItems;
            }
        }
    })
});
