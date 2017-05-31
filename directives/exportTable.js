define(['qvangular', 'qlik'], function(qva, qlik) {

    var app = qlik.currApp();

    qva.directive('exportTableButton', ['qlikService', function(qlikService){
        return {
            restrict: 'E',
            template: '<div class="exportButtonContainer" ng-show="displayExportButton">' +
                '<button ng-click="exportData()"><span class="lui-icon lui-icon--download"></span></button></div>',
            scope: {
                tab: '='
            },
            link: function(scope){
                scope.table, scope.data;
                scope.displayExportButton = false;

                app.getObject(scope.tab.objectid).then(function(model){
                    return qlikService.getAllDataRows(model);
                }).then(function(data){
                    if(data instanceof Array && data.length > 0){
                        scope.displayExportButton = true;
                        scope.data = data;
                    }
                });

                scope.exportData = function() {
                    var csvContent = 'data:text/csv;charset=utf-8,';
                    var dataString, encodeUri;

                    scope.data.forEach(function(dataArray, index){
                        dataArray = dataArray.map(function(cell){ return cell.qText; });
                        dataString = dataArray.join(',');
                        csvContent += (index < scope.data.length) ? dataString + '\n' : dataString;
                    });

                    triggerDownload(csvContent);
                }
            }
        }
    }]);

    /** PRIVATE FUNCTIONS */
    function getHypercubeData(hypercube){
        return hypercube.qHyperCube.qDataPages[0].qMatrix.map(function(row) {
            return row.map(function(cell){ return cell.qText; })
        });
    }

    function triggerDownload(csvContent){
        var encodedUri = encodeURI(csvContent);
        var link = document.createElement('a');

        link.setAttribute('href', encodedUri)
        link.setAttribute('download', 'data.csv');
        document.body.appendChild(link);
        link.click();
    }
})
