export default {
    columnizeString: function(string, columnWidth) {
        var columns = [];

        if (columnWidth) {
            for (let i = 0; i < string.length; i += columnWidth) {
                columns.push(string.substr(i, columnWidth) + ' ');
            }
        }

        return columns.join('');
    },

    calculateRowLength: function(charWidth, viewWidth, columnWidth) {
        if (!(charWidth && viewWidth)) return 0;

        var baseRowLength = Math.floor(viewWidth / charWidth);
        var adjustedRowLength = baseRowLength;

        if (columnWidth) {
            adjustedRowLength -= Math.floor(baseRowLength / columnWidth);
            adjustedRowLength = Math.floor(adjustedRowLength / columnWidth) * columnWidth;
        }

        return adjustedRowLength;
    },

    elementWidth: function(elem) {
        return (elem) ? parseFloat(getComputedStyle(elem).width) : 0;
    },

    sliceLayer: function(layer, offset, columnWidth, charWidth, sequenceLength) {
        var slicedLayer = {};

        if (layer) {
            // slice the layer
            slicedLayer.start = layer.start - offset;
            slicedLayer.width = layer.end - layer.start;

            // crop the layer
            slicedLayer.width = (slicedLayer.start + slicedLayer.width > sequenceLength) ? sequenceLength - slicedLayer.start : slicedLayer.width;

            // insert gutters
            let preGutters = slicedLayer.start / columnWidth;
            let midGutters = (slicedLayer.start + slicedLayer.width) / columnWidth - preGutters;

            slicedLayer.start += preGutters;
            slicedLayer.width += midGutters;

            // multiply by characters
            slicedLayer.start *= charWidth;
            slicedLayer.width *= charWidth;
        }

        return slicedLayer;
    },

    layerInBounds: function(layer, bounds) {
        return ((layer.start <= bounds.end) && layer.start + layer.width >= bounds.start);
    }
}
