define(['qlik', 'qvangular', 'angular'], function(qlik, qva, angular){

    var $injector = angular.injector(['ng']);
    var Promise = $injector.get('$q');
    var initialDataFetch = [{qTop: 0, qWidth: 20, qLeft: 0, qHeight: 500}];


    qva.service('qlikService', function(){
        var service = {};

        service.getAllDataRows = getAllDataRows;

        function getAllDataRows(model) {
            var qTotalData = [];
            var deferred = Promise.defer();

            model.getHyperCubeData('/qHyperCubeDef', initialDataFetch).then(function(data){
                var columns = model.layout.qHyperCube.qSize.qcx;
                var totalHeight = model.layout.qHyperCube.qSize.qcy;
                var pageHeight = Math.floor(10000 / columns);
                var numberOfPages = Math.ceil(totalHeight / pageHeight);

                if (numberOfPages === 1) {
                    (data.qDataPages) ? deferred.resolve(data.qDataPages[0].qMatrix)
                        : deferred.resolve(data[0].qMatrix);
                } else {
                    var promises = Array.apply(null, new Array(numberOfPages)).map(function (data, index) {
                        return model.getHyperCubeData('/qHyperCubeDef', [getNextPage(pageHeight,index, columns)]);
                    }, this);

                    Promise.all(promises).then(function(data){
                        for (var j = 0; j < data.length; j++) {
                            if (data[j].qDataPages) {
                                for (var k1 = 0; k1 < data[j].qDataPages[0].qMatrix.length; k1++) {
                                  qTotalData.push(data[j].qDataPages[0].qMatrix[k1]);
                                }
                            } else {
                                for (var k2 = 0; k2 < data[j][0].qMatrix.length; k2++) {                        
                                  qTotalData.push(data[j][0].qMatrix[k2]);
                                }
                            }
                        }
                        deferred.resolve(qTotalData);
                    })
                }
            })
            return deferred.promise;
        }
        return service;
    });

    /** PRIVATE FUNCTIONS */
    function getNextPage(pageHeight, index, columns){
        return {
            qTop: (pageHeight * index) + index,
            qLeft: 0,
            qWidth: columns,
            qHeight: pageHeight,
            index: index
        }
    }
})
