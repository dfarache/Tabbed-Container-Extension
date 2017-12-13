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
                activeTab: '=',
                hideButton: '=',
                csvSeparator: '='
            },
            link: function(scope){
                scope.table, scope.data;
                scope.displayDataLoadingModal = false;
                scope.isLoadingData = true;
                scope.hideButton = (typeof scope.hideButton === 'boolean') ? scope.hideButton : true;

                // check if the object has a qhypercube. if it doesn't, it can't be exported
                app.getObject(scope.activeTab.objectid).then(function(model) {
                    scope.canExportData = (model.layout.qHyperCube != null);
                });

                scope.getObjectData = function(){
                    if(!scope.canExportData) { return; }

                    return app.getObject(scope.activeTab.objectid).then(function(model){
                        var numDimensions = model.layout.qHyperCube.qDimensionInfo.length;
                        var layout = model.layout;
                        var isStackedBarchart = layout.visualization === 'barchart' && layout.barGrouping.grouping === 'stacked';

                        if(numDimensions > 1 && (isStackedBarchart || layout.visualization === 'linechart')) {
                            return qlikService.getAllStackedDataRows(model);
                        } else if(layout.visualization === 'pivot-table') {
                            return qlikService.getAllPivotDataRows(model);
                    	  } else {
                            return qlikService.getAllDataRows(model);
                        }
                    })
                }

                scope.prepareDataForDownload = function() {
                    scope.displayDataLoadingModal = true;
                    scope.isLoadingData = true;

                    scope.getObjectData().then(function(data) {
                          scope.isLoadingData = false;

                          if(data instanceof Array && data.length > 0){
                              scope.canExportData = true;
                              scope.data = data;
                          } else {
                              scope.canExportData = false;
                          }
                    });
                }

                scope.exportData = function() {
                    triggerDownload( arrayToCsv(scope.data, getExportFormat(scope.csvSeparator)) );
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

                scope.closeModal = function(ev){
                    scope.displayModal = false;
                    ev.stopPropagation();
                }
            }
        }
    })

    /** PRIVATE FUNCTIONS */
    function getExportFormat(formatType){
        var validTypes = ['CSV', 'TSV', 'SSV', 'XLSX'];
        formatType = (typeof formatType === 'string' && validTypes.indexOf(formatType) !== -1)
            ? formatType
            : 'TSV';

        switch (formatType) {
            case 'CSV':
                return { separator: ',', file: '.csv', type: 'text/csv;charset=utf-8' };
            case 'TSV':
                return { separator: '\t', file: '.csv', type: 'text/csv;charset=utf-8' };
            case 'SSV':
                return { separator: ';', file: '.csv', type: 'text/csv;charset=utf-8' };
            case 'XLSX':
                return { separator: ',', file: '.xls', type: 'application/xls'  }
        }
    }

    function getHypercubeData(hypercube){
        return hypercube.qHyperCube.qDataPages[0].qMatrix.map(function(row) {
            return row.map(function(cell){ return cell.qText; })
        });
    }

    function arrayToCsv(data, exportFormat){
        var csvContent = '';
        var dataString;

        data.forEach(function(dataArray, index){
            dataArray = dataArray.map(function(cell){ return '"' + cell.qText + '"'; });
            dataString = dataArray.join(exportFormat.separator);
            csvContent += (index < data.length) ? dataString + '\n' : dataString;
        });

        return { data: csvContent, exportFormat: exportFormat };
    }

    function triggerDownload(content){
        var BOM = '\uFEFF';
        var data = BOM + content.data;
        var blob = new Blob([data], { type: content.exportFormat.type });
        saveAs(blob, 'data' + content.exportFormat.file);
    }
})
