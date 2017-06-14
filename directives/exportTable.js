define([
    'qvangular',
    'qlik',
    'filesaver',
    'text!./templates/exportTable.html'
], function(qva, qlik, FileSaver, ngTemplate) {

    var app = qlik.currApp();

    qva.directive('exportTableButton', ['qlikService', function(qlikService){
        return {
            restrict: 'E',
            template: ngTemplate,
            scope: {
                tab: '=',
                hideButton: '='
            },
            link: function(scope){
                scope.table, scope.data;
                scope.canExportData = false;
                scope.hideButton = (typeof scope.hideButton === 'boolean') ? scope.hideButton : true;

                app.getObject(scope.tab.objectid).then(function(model){
                    return qlikService.getAllDataRows(model);
                }).then(function(data){
                    if(data instanceof Array && data.length > 0){
                        scope.canExportData = true;
                        scope.data = data;
                    }
                });

                scope.exportData = function() {
                    var csvContent = '';
                    var dataString;

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
        var BOM = '\uFEFF';
        var data = BOM + csvContent;
        var blob = new Blob([data], { type: 'text/csv;charset=utf-8' });
        saveAs(blob, 'data.csv');
    }
})
