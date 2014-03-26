YUI.add('gallery-magnifier', function (Y, NAME) {

var _C = function() {
        this._image = {};
        _C.superclass.constructor.apply(this, arguments);
       },
   MAGNIFIER = 'Magnifier',
   MAGNIFIER_LC = 'magnifier',
   CLASSNAME = Y.ClassNameManager.getClassName(MAGNIFIER_LC, 'display'),
   HIDECLASS = Y.ClassNameManager.getClassName(MAGNIFIER_LC, 'hidden'),
   TEMPLATE = "<div><img /></div>";

_C.NAME = MAGNIFIER;
_C.NS = MAGNIFIER;
_C.ATTRS =
    {
        host: {
            validator:function(node) {
                if(!node.test('img')) {
                    Y.error(MAGNIFIER + " can't be attached to this node.");
                    return false;
                }
                return true;
            }
        },
        follow: {
            value: false,
            validator: Y.Lang.isBoolean
        },
        display: {
            writeOnce: true,
            setter: function(node) {
                node = Y.one(node);
                return node;
            }
        },
        height: {
            value: 100,
            validator: Y.Lang.isNumber
        },
        width: {
            value: 100,
            validator: Y.Lang.isNumber
        },
        zoom: {
            value: 2,
            validator: Y.Lang.isNumber
        },
        staticX: {
            validator: Y.Lang.isNumber
        },
        staticY: {
            validator: Y.Lang.isNumber
        }
    };
Y.extend(_C, Y.Plugin.Base, {
    initializer: function() {
        var host = this.get('host'), image = this._image;
        image.width = parseInt(host.getStyle('width'), 10);
        image.height = parseInt(host.getStyle('height'), 10);
        image.left = host.getX();
        image.top = host.getY();
        image.right = image.left + image.width;
        image.bottom = image.top + image.height;

        this._renderDisplay();
        this._bindEvents();
    },
    destructor: function() {
        this._unbindEvents();
        this._destroyDisplay();
    },
    _bindEvents: function() {
        var host = this.get('host'),
        display = this.get('display'),
        follow = this.get('follow');
        if (!follow) {
            this._MM = host.on('mousemove', this._moveViewport, this);
            this._MO = host.on('mouseout', function() {
                display.addClass(HIDECLASS);
            }, this);
            this._ME = host.on('mouseover', function() {
                display.removeClass(HIDECLASS);
            }, this);
        } else {
            this._ME = host.on('mouseover', function() {
                display.removeClass(HIDECLASS);
                this._MM = Y.one('body').on('mousemove', this._moveViewport, this);
            }, this);
        }
    },
    _unbindEvents: function() {
        if (this._MM) { this._MM.unbind(); }
        if (this._MO) { this._MO.unbind(); }
        if (this._ME) { this._ME.unbind(); }
    },
    _destroyDisplay: function() {
        this.get('display').remove();
    },
    _renderDisplay: function() {
        var display = this.get('display'),
            height = this.get('height'),
            width = this.get('width');

        if (!Y.Lang.isValue(display)) {
            display = Y.Node.create('<div></div>');
            this.set('display', display);
            this.get('host').get('parentNode').append(display);
        }

        display.setContent(TEMPLATE);
        display.setStyle('height', height);
        display.setStyle('width', width);
        display.setStyle('position', 'absolute');

        if (!this.get('follow')) {
            display.setXY([this.get('staticX'), this.get('staticY')]);
            display.one('div').setStyle('position', 'relative');
        } else {
            display.setXY([0, 0]);
        }

        display.addClass(CLASSNAME);
        this._configureImage();
        display.addClass(HIDECLASS);
    },
    _configureImage: function() {
        var magnificationFactor = this.get('zoom'),
            display = this.get('display'),
            host = this.get('host'),
            img = display.one('img');

        img.set('src', host.get('src'));
        img.setStyles({height: this._image.height * magnificationFactor,
                   width: this._image.width * magnificationFactor});
    },
    _moveViewport: function(e) {
        var imageData = this._image,
            magnificationFactor = this.get('zoom'),
            display = this.get('display'),
            view = display.one('div'),
            x = e.pageX - imageData.left,
            y = e.pageY - imageData.top,
            heightMod = this.get('height') / 2,
            widthMod = this.get('width') / 2,
            newX = -x * magnificationFactor + heightMod,
            newY = -y * magnificationFactor + widthMod;

        if(e.pageX >= imageData.left && e.pageX <= imageData.right && e.pageY >= imageData.top && e.pageY <= imageData.bottom) {
            if (this.get('follow')) {
                display.setXY([e.pageX - widthMod, e.pageY - heightMod]);
            }
            view.setStyles({
                left: newX,
                top: newY
            });
            //view.setXY([newX, newY]);
        } else {
            display.addClass(HIDECLASS);
            this._MM.detach();
        }
    }
});
Y.Magnifier = _C;


}, 'gallery-2012.12.05-21-01', {"requires": ["plugin", "node-pluginhost", "node-style", "node-screen", "classnamemanager"]});
