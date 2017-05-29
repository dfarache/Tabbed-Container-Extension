define(["angular", "qvangular", "qlik"], function(a, b, c) {
    "use strict";
    b.service("tabService", ["$q",
        function(q) {

            return {

                getTabInfo: function($scope) {

                    var tabItems = [];

                    for(var tabLoop = 0; tabLoop < 5; tabLoop++) {
                        var title = $scope.layout["tab" + (tabLoop + 1).toString() + "Title"];
                        var id = $scope.layout["tab" + (tabLoop + 1).toString() + "ObjectId"];

                        if(title.length > 0 && id.length > 0) {
                            // both pieces of information are present, so add it to the return array:
                            tabItems.push({
                                id: id + tabLoop.toString(),
                                objectid: id,
                                title: title,
                                index: tabLoop
                            });
                        }
                    }

                    return tabItems;
                }
            }
        }
    ])
});
