define([
    'qvangular',
    '../constants/colors'
], function(qva, colors) {

    qva.service('colorsService', [function(){
        var service = {};

        service.hexToRgb = hexToRgb;
        service.toString = toString;

        function hexToRgb(inputColor) {
            var hex = (typeof inputColor === 'object')
                ? inputColor.color
                : colors.palette[inputColor];

            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        }

        function toString(rgb, opacity) {
            return 'rgba(' + rgb.r + ',' +
                rgb.g + ',' +
                rgb.b + ',' +
                (opacity || 1) + ')'
        }

        return service;
    }])
})
