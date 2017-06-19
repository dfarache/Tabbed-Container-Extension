define([
    'qvangular',
    'qlik',
    'filesaver',
    'text!./templates/exportTable.html',
    'text!./templates/dataLoadingModal.html'
], function(qva, qlik, FileSaver, ngTemplateButton, ngTemplateModal) {

    var app = qlik.currApp();

    qva.directive('exportTableButton', ['qlikService', function(qlikService){
        return {
            restrict: 'E',
            template: ngTemplateButton,
            scope: {
                tab: '=',
                hideButton: '='
            },
            link: function(scope){
                scope.table, scope.data;
                scope.canExportData = false;
                scope.displayDataLoadingModal = false;
                scope.isLoadingData = true;
                scope.hideButton = (typeof scope.hideButton === 'boolean') ? scope.hideButton : true;

                app.getObject(scope.tab.objectid).then(function(model){
                    return qlikService.getAllDataRows(model);
                }).then(function(data){
                    scope.isLoadingData = false;

                    if(data instanceof Array && data.length > 0){
                        scope.canExportData = true;
                        scope.data = data;
                    }
                });

                scope.exportData = function() {
                    if(scope.isLoadingData) {
                        scope.displayDataLoadingModal = true;
                    } else {
                        triggerDownload(
                            arrayToCsv(scope.data)
                        );
                    }
                }
            }
        }
    }]);

    qva.directive('loadingModal', function(){
        return {
            restrict: 'E',
            template: ngTemplateModal,
            scope: {
                isLoadingData: '<',
                exportData: '&',
                displayModal: '='
            },
            link: function(scope, elem){
                var container = $(elem);
                var card = $(elem).find('.dataLoadingModal')[0];

                $(elem).appendTo('body');

                scope.closeAndExport = function(){
                    scope.displayModal = false;
                    scope.exportData();
                }
            }
        }
    })

    /** PRIVATE FUNCTIONS */
    function getHypercubeData(hypercube){
        return hypercube.qHyperCube.qDataPages[0].qMatrix.map(function(row) {
            return row.map(function(cell){ return cell.qText; })
        });
    }

    function arrayToCsv(data){
        var csvContent = '';
        var dataString;

        data.forEach(function(dataArray, index){
            dataArray = dataArray.map(function(cell){ return cell.qText; });
            dataString = dataArray.join(',');
            csvContent += (index < data.length) ? dataString + '\n' : dataString;
        });

        return csvContent;
    }

    function triggerDownload(csvContent){
        var BOM = '\uFEFF';
        var data = BOM + csvContent;
        var blob = new Blob([data], { type: 'text/csv;charset=utf-8' });
        saveAs(blob, 'data.csv');
    }
})
