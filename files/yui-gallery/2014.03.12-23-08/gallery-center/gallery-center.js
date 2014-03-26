YUI.add('gallery-center', function(Y) {

var NS = Y.namespace('apm'),

    C = function(config) {
        C.superclass.constructor.apply(this, arguments);
        this._host = config.host;
    };

C.NAME = 'Center';

/**
* @property apm_center
* @description apm_center is the namespace for this plugin
* @type {String}
*/
C.NS = 'apm_center';

// The center attribute could be updated on xyChange when/if Node
// supports change events for its attributes.
// C.ATTRS = {
//     center: {}
// };

Y.extend(C, Object, {

    /**
     * Calculates the offset from the top/left to the center.
     */
    offset: function(region) {
        region = region || this._host.get('region');
        return [Math.floor(region.width / 2), Math.floor(region.height / 2)];
    },

    /**
     * Calculates and returns the center point of the node instance's
     * underlying DOM node.
     */
    calc:function() {
        var region = this._host.get('region'),
            offset = this.offset(region);
        return [region.left + offset[0], region.top + offset[1]];
    },

    /**
     * Sets the center of the node to the position supplied.  
     * accepts x/y coordinates as individual paramters or an array.  Also
     * accepts an event object with pageX and pageY attributes.
     */
    to: function(x, y) {

        switch (Y.Lang.type(x)) {
            case 'array':
                y = x[1];
                x = x[0];
                break;
            case 'object':
                y = x.pageY;
                x = x.pageX;
                break;
            default:
        }

        var offset = this.offset(),
            coords =  [x - offset[0], y - offset[1]];

        this._host.setXY(coords);
        return coords;
    }
});

NS.Center = C;


}, 'gallery-2010.02.19-03' ,{requires:['node-pluginhost','node-screen']});
