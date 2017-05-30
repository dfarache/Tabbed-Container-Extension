define(["qvangular"], function(qva) {
    "use strict";

    qva.service("tabService", function() {

        return {

            getTabInfo: function($scope) {
                var tabItems = [];
                var maxTabItems = 5;
                var objectid;

                for(var i=1; i<=maxTabItems; i++) {
                    // HACK: line needed to upgrade the current systems
                    $scope.layout["tab" + i + "MasterItem"] = ($scope.layout["tab" + i + "MasterItem"] === undefined) ?
                        "" : $scope.layout["tab" + i + "MasterItem"];

                    var title = $scope.layout["tab" + i + "Title"];
                    var textId = $scope.layout["tab" + i + "ObjectId"];
                    var masterItem = $scope.layout["tab" + i + "MasterItem"];

                    if(title.length > 0 && (masterItem.length > 0 || textId.length > 0)) {
                        objectid = (textId.length > 0) ? textId : masterItem;

                        tabItems.push({
                            id: i + objectid,
                            objectid: objectid,
                            title: title,
                            index: i
                        })
                    }
                }

                return tabItems;
            }
        }
    })
});
